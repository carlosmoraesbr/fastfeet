import * as Yup from 'yup';
import Order from '../models/Order';
import User from '../models/User';
import Recipient from '../models/Recipient';
import DeliveryProblems from '../models/DeliveryProblems';

import CancellationDeliveryProblemsMail from '../jobs/CancellationDeliveryProblemsMail';
import Queue from '../../lib/Queue';

class DeliveryController {
  async index(req, res) {
    const { orderId } = req.params;

    const deliveryProblem = await DeliveryProblems.findAll({
      where: { order_id: orderId },
      attributes: ['id', 'description'],
      include: [
        {
          model: Order,
          as: 'order',
          attributes: ['id', 'product', 'start_date'],
        },
      ],
    });

    return res.json(deliveryProblem);
  }

  async store(req, res) {
    const { orderId } = req.params;

    const schema = Yup.object().shape({
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const checkIsOrder = await Order.findOne({
      where: { id: orderId },
    });

    if (!checkIsOrder) {
      return res.status(401).json({ error: 'Order not exists' });
    }

    const { description } = req.body;

    const deliveryProblem = await DeliveryProblems.create({
      order_id: orderId,
      description,
    });

    return res.json(deliveryProblem);
  }

  async delete(req, res) {
    const { deliveryProblemId } = req.params;

    const deliveryProblem = await DeliveryProblems.findByPk(deliveryProblemId, {
      include: [
        {
          model: Order,
          as: 'order',
          attributes: ['id', 'product', 'start_date'],
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
        },
      ],
    });

    await Queue.add(CancellationDeliveryProblemsMail.key, {
      deliveryProblem,
    });

    return res.json(deliveryProblem);
  }
}

export default new DeliveryController();
