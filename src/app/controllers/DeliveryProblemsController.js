import User from '../models/User';

class DeliveryController {
  async index(req, res) {
    const { id } = req.params;

    const checkUserDeliveryman = await User.findOne({
      where: { id, deliveryman: true },
    });

    if (!checkUserDeliveryman) {
      return res.status(401).json({ error: 'User is not a deliveryman' });
    }

    return res.json();
  }

  async store(req, res) {
    return res.json();
  }

  async delete(req, res) {
    return res.json();
  }
}

export default new DeliveryController();
