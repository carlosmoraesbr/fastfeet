import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';
import Order from '../models/Order';
import User from '../models/User';

class DeliveryController {
  async index(req, res) {
    const { deliverymanId } = req.params;

    const checkUserDeliveryman = await User.findOne({
      where: { deliverymanId, deliveryman: true },
    });

    if (!checkUserDeliveryman) {
      return res.status(401).json({ error: 'User is not a deliveryman' });
    }

    const { date } = req.query;
    const parsedDate = parseISO(date);

    const orders = await Order.findAll({
      where: {
        deliveryman_id: deliverymanId,
        canceled_at: null,
        start_date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        },
      },
      order: ['start_date'],
    });

    return res.json(orders);
  }
}

export default new DeliveryController();
