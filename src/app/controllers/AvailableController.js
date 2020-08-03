import { startOfDay, endOfDay, setHours, setMinutes, setSeconds, format, isAfter } from 'date-fns';
import Appointment from '../models/Appointment';
import { Op } from 'sequelize';

class AvailableController{
    async show(req, res){
        const { date } = req.query;
        if (!date){
            return res.status(400).json( { erro: 'Data inválida.' } );
        }

        const searchDate = Number(date);
        const appointments = await Appointment.findAll({
            where: {
                provider_id: req.params.providerId,
                canceled_at: null,
                date: {
                    [ Op.between ]: [startOfDay(searchDate), endOfDay(searchDate)]
                 }
             }
        });

        const schedule = [
            '01:00',
            '08:00',
            '09:00',
            '10:00',
            '11:00',
            '13:00',
            '14:00',
            '15:00',
            '16:00',
            '17:00',
            '18:00'
        ];

        const available = schedule.map( time => {
            const [hour, minute] = time.split(':');
            const value = setSeconds(setMinutes(setHours(searchDate, hour), minute), 0);

            return {
                time,
                value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"),
                available:
                isAfter(value, new Date()) &&
                !appointments.find(appoint => format(appoint.date, 'HH:mm') == time),
            };
        });

        return res.status(200).json(available);
    }
}

export default new AvailableController();
