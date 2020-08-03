import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class CancellationMail{

    get key(){
        return 'CancellationMail';
    }

    async handle({ data }){
        const { appointment } = data;

        await Mail.sendMail({
                to: `${appointment.provider.name} <${appointment.provider.email}>`,
                subject: 'Agendamento Cancelado',
                template: 'cancelation',
                context: {
                 provider: appointment.provider.name,
                 user: appointment.user.name,
                 date: format(
                    parseISO(appointment.date),
               "'no dia' dd 'de' MMMM, 'às' H:MM'h'",
               { locale: pt }),
            },
        });
    }
}

export default new CancellationMail();
