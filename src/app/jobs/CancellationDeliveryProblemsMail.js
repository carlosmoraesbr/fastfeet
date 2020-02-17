import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class CancellationDeliveryProblemsMail {
  get key() {
    return 'CancellationDeliveryProblemsMail';
  }

  async handle({ data }) {
    const { order, description } = data.deliveryProblem;

    await Mail.sendMail({
      to: `${order.deliveryman.name} <${order.deliveryman.email}>`,
      subject: 'Encomenda cancelada',
      template: 'cancellationDeliveryProblems',
      context: {
        description,
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

  handleFailure(job, err) {
    console.log(`Queue ${job.name.error} FAILED`, err);
  }
}

export default new CancellationDeliveryProblemsMail();
