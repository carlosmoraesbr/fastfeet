import * as Yup from 'yup';
import User from '../models/User';
import Order from '../models/Order';

class OrderController {
  async store(req, res) {
    const schema = Yup.object().shape({
      deliveryman_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { deliveryman_id, recipient_id, start_date } = req.body;

    /**
     * Check is deliveryman_id is a deliveryman
     */
    const isDeliveryman = await User.findOne({
      where: { id: deliveryman_id, deliveryman: true },
    });

    if (!isDeliveryman) {
      return res
        .status(401)
        .json({ error: 'You can only create orders with deliverymen' });
    }

    const order = await Order.create({
      user_id: req.userId,
      deliveryman_id,
      recipient_id,
      start_date,
    });

    return res.json(order);
  }
}

export default new OrderController();
