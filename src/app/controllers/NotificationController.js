import Notification from '../schemas/Notification';
import User from '../models/User';

class NotificationController {
  async index(req, res) {
    const checkisDeliveryman = await User.findOne({
      where: { id: req.userId, deliveryman: true },
    });

    if (!checkisDeliveryman) {
      return res
        .status(401)
        .json({ error: 'Only deliveryman can load notifications' });
    }

    const notifications = await Notification.find({
      user: req.userId,
    })
      .sort({ createdAt: 'desc' })
      .limit(20);

    return res.json(notifications);
  }
}

export default new NotificationController();
