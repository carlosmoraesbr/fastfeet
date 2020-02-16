import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class CancellationDeliveryProblemsMail {
  get Key() {
    return 'CancellationDeliveryProblemsMail';
  }

  async handle({ data }) {
    const { order } = data;

    await Mail.sendMail({
      to: `${order.deliveryman.name} <${order.deliveryman.email}>`,
      subject: 'Encomenda cancelada',
      template: 'cancellationDeliveryProblems',
      context: {
        deliveryman: order.deliveryman.name,
        recipient: order.recipient.name,
        date: format(
          parseISO(order.start_date),
          "'dia' dd 'de' MMMM', às' H:mm'h'",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new CancellationDeliveryProblemsMail();
