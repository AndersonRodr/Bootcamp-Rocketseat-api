import Notification from '../../app/schemas/Notifications';
import User from '../../app/models/User';

class NotificationController {

    async index(req, res){

        const userProvider = await User.findOne({ where: { id: req.userId, provider: true } });

        if (!userProvider){
            res.status(404).json({ erro: 'Não permitido. Apenas prestadores de serviço.'});
        }

        const notifications = await Notification.find(
            { user: req.userId,} ).sort({ createdAt: 'desc' }).limit(20);

        return res.status(200).json(notifications);
    }

    async update(req, res){
        const notification = await Notification.findByIdAndUpdate(req.params.id, {read: true }, { new: true });
        return res.status(200).json(notification);
    }
}

export default new NotificationController();
