import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';
import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, isAfter, addHours, format, subHours } from 'date-fns';
import pt from 'date-fns/locale/pt';
import NotificationSchema from '../schemas/Notifications';

import CancellationMail from '../jobs/CancellationMail';
import Queue from  '../../lib/Queue';

class AppointmentController{
    async store(req, res){
        const schema = Yup.object().shape({
            date: Yup.date().required(),
            provider_id: Yup.number().required(),
        })

        if (! (await schema.isValid(req.body))){
            return res.status(400).json({ erro: 'Campos inválidos.' });
        }

        if (req.body.provider_id == req.userId){
            return res.status(400).json({erro: 'Não é possível criar este agendamento.'});
        }

        const date = req.body.date;
        const provider_id = req.body.provider_id;
        //Verificar se o provider não é um usuário comum
        const provider = await User.findOne({ where: {id: provider_id} });
        if (!provider.provider){
            return res.status(400).json({ erro: 'A pessoa escolhida não é um funcionário.' })
        }

        const hourStart = startOfHour(parseISO(date));

        //Verifica se a data escolhida é anterior ao dia atual
        if (isBefore(hourStart, new Date())){
            return res.status(400).json( { erro: 'A data selecionada não permitida.'} );
        }

        //Verifica se o funcionário não tem um agendamento já marcado para quela hora
        const appointmentValidation = await Appointment.findOne({
            where: {
                provider_id: provider_id,
                canceled_at: null,
                date: hourStart,
            }
        });

        if(appointmentValidation){
            return res.status(400).json({ erro: 'Horário indisponível para este funcionário.' });
        }

        const appointment = await Appointment.create({
            date: hourStart,
            provider_id: provider_id,
            user_id: req.userId,
        });

        //Notificar o prestador de serviço;

        const user = await User.findByPk(req.userId);
        const dateFormated = format(
            hourStart,
            "'no dia' dd 'de' MMMM, 'às' H:MM'h'",
            { locale: pt }
        );

        await NotificationSchema.create({
            content: `Um novo agendamento para ${user.name}, ${dateFormated}`,
            user: provider_id,
        })

        return res.status(200).json(appointment);
    }

    async index(req, res){

        const appointments = await Appointment.findAll();

        if (appointments.length == 0){
            return res.status(404).json({erro: 'Nenhum agendamento encontrado'});
        }

        return res.status(200).json(appointments);
    }

    async indexUser(req, res){
        const { page = 1 } = req.query;

        const appointments = await Appointment.findAll( {
            where: {
                user_id: req.userId,
                canceled_at: null,
            },
            order: ['date'],
            attributes: ['id', 'date', 'past', 'cancelable'],
            limit: 20,
            offset: (page - 1) * 20,
            include: [
                {
                model: User,
                as: 'provider',
                attributes: ['id', 'name'],
                include: [
                    {
                        model: File,
                        as: 'avatar',
                        attributes: ['id', 'name', 'path', 'url'],
                    }
                ]
            }
        ]
        });

        if (appointments.length == 0){
            return res.status(400).json({ erro: 'Nenhum agendamento encontrado.' });
        }

        return res.status(200).json(appointments);
    }

    async cancel(req, res){
        const appointment = await Appointment.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    as: 'provider',
                    attributes: ['name', 'email'],
                },
                {
                    model: User,
                    as: 'user',
                    attributes: ['name'],
                }
            ]
        });
        if(!appointment){
            return res.status(404).json({ erro: 'Agendamento não encontrado.' });
        }

        if(appointment.user_id != req.userId){
            return res.status(400).json({ erro: 'Não pe possível cancelar este agedamento' });
        }

        const horarioCorretoCancelar = subHours(appointment.date, 2);

        if (isBefore(horarioCorretoCancelar, new Date())){
            return res.status(400).json({ erro: 'Não é possível cancelar agendamento com menos de duas horas de antecedência.' });
        }

        appointment.canceled_at = new Date();
        await appointment.save();

        await Queue.add(CancellationMail.key, {appointment});

        return res.status(200).json(appointment);

    }
}

export default new AppointmentController();
