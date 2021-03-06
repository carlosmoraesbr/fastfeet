import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import pt from 'date-fns/locale/pt';
import User from '../models/User';
import File from '../models/File';
import Order from '../models/Order';
import Recipient from '../models/Recipient';
import Notification from '../schemas/Notification';

import CancellationMail from '../jobs/CancellationMail';
import RegistrationMail from '../jobs/RegistrationMail';
import Queue from '../../lib/Queue';

class OrderController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const orders = await Order.findAll({
      where: { deliveryman_id: req.userId, canceled_at: null },
      order: ['start_date'],
      attributes: ['id', 'start_date', 'past', 'cancelable'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: File,
          as: 'signature',
          attributes: ['id', 'path', 'url'],
        },
        {
          model: User,
          as: 'deliveryman',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'id',
            'name',
            'street',
            'number',
            'complement',
            'state',
            'city',
            'zipcode',
          ],
        },
      ],
    });

    return res.json(orders);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      deliveryman_id: Yup.number().required(),
      recipient_id: Yup.number().required(),
      product: Yup.string().required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { deliveryman_id, recipient_id, start_date, product } = req.body;

    /**
     * Check is deliveryman_id is a deliveryman
     */
    const checkisDeliveryman = await User.findOne({
      where: { id: deliveryman_id, deliveryman: true },
    });

    if (!checkisDeliveryman) {
      return res
        .status(401)
        .json({ error: 'You can only create orders with deliverymen' });
    }

    /**
     * Check for past dates
     */
    const hourStart = startOfHour(parseISO(start_date));

    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }

    /**
     * Check date availability
     */

    const checkAvailability = await Order.findOne({
      where: {
        deliveryman_id,
        canceled_at: null,
        start_date: hourStart,
      },
    });

    if (checkAvailability) {
      return res.status(400).json({ error: 'Order date is not available' });
    }

    const { id } = await Order.create({
      user_id: req.userId,
      deliveryman_id,
      recipient_id,
      product,
      start_date: hourStart,
    });

    const order = await Order.findByPk(id, {
      include: [
        {
          model: User,
          as: 'deliveryman',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['id', 'name'],
        },
      ],
    });

    /**
     * Notify order deliveryman
     */
    const user = await User.findByPk(req.userId);
    const formattedDate = format(
      hourStart,
      "'dia' dd 'de' MMMM', às' H:mm'h'",
      { locale: pt }
    );

    await Queue.add(RegistrationMail.key, {
      order,
    });

    await Notification.create({
      content: `Nova encomenda de ${user.name} para ${formattedDate}`,
      user: deliveryman_id,
    });

    return res.json(order);
  }

  async delete(req, res) {
    const order = await Order.findByPk(req.params.orderId, {
      include: [
        {
          model: User,
          as: 'deliveryman',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['id', 'name'],
        },
      ],
    });

    if (order.deliveryman_id !== req.userId) {
      return res.status(401).json({
        error: "You don't have permission to cancel this order",
      });
    }

    const dateWithSub = subHours(order.date, 2);

    if (isBefore(dateWithSub, new Date())) {
      return res.status(401).json({
        error: 'You can only cancel orders 2 hours in advance.',
      });
    }

    order.canceled_at = new Date();

    await order.save();

    await Queue.add(CancellationMail.key, {
      order,
    });

    return res.json(order);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
      product: Yup.string(),
      deliveryman_id: Yup.number(),
      recipient_id: Yup.number(),
      signature_id: Yup.number(),
      start_date: Yup.date(),
      end_date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id } = req.body;

    const order = await Order.findOne({
      where: { id },
    });

    if (!order) {
      return res.status(400).json({ error: 'Order does not exist' });
    }

    const {
      product,
      deliveryman_id,
      recipient_id,
      signature_id,
      start_date,

      end_date,
    } = await order.update(req.body);

    return res.json({
      product,
      deliveryman_id,
      recipient_id,
      signature_id,
      start_date,
      end_date,
    });
  }
}

export default new OrderController();
