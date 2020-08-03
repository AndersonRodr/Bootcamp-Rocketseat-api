import User from '../models/User';
import Appointment from '../models/Appointment';
import { startOfDay, endOfDay, parseISO, startOfHour, addHours } from 'date-fns';
import { Op } from 'sequelize';

class ScheduleController {

    async index(req, res){
        const userProvider = await User.findOne( { where: { id: req.userId, provider: true } } );
        if (!userProvider){
            return res.status(400).json({ erro: 'O usuário não é prestador de serviço.' });
        }

        const { date } = req.query;
        const parsedDate = parseISO(date);
        const scheduleList = await Appointment.findAll( {
            where: {
                provider_id: req.userId,
                canceled_at: null,
                date: {
                    [Op.between]: [ startOfDay(parsedDate), endOfDay(parsedDate) ]
                }
            },
            order: ['date']
        } );

        if (scheduleList.length == 0){
            return res.status(404).json({ erro: 'Agendamentos não encontrados.' });
        }

        return res.status(200).json(scheduleList);
    }

}

export default new ScheduleController;
