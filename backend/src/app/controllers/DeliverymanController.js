import User from '../models/User';
import File from '../models/File';

class DeliverymanController {
  async index(req, res) {
    const deliverymen = await User.findAll({
      where: { deliveryman: true },
      attributes: ['id', 'name', 'email', 'avatar_id'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    return res.json(deliverymen);
  }
}

export default new DeliverymanController();
