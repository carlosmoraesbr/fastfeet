import User from '../models/User';

class DeliverymanController {
  async index(req, res) {
    const deliverymans = await User.findAll({
      where: { deliveryman: true },
    });

    return res.json(deliverymans);
  }
}

export default new DeliverymanController();
