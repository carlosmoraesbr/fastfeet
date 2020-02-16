import Sequelize, { Model } from 'sequelize';
import { isBefore, subHours } from 'date-fns';

class Order extends Model {
  static init(sequelize) {
    super.init(
      {
        product: Sequelize.STRING,
        start_date: Sequelize.DATE,
        canceled_at: Sequelize.DATE,
        past: {
          type: Sequelize.VIRTUAL,
          get() {
            return isBefore(this.start_date, new Date());
          },
        },
        cancelable: {
          type: Sequelize.VIRTUAL,
          get() {
            return isBefore(new Date(), subHours(this.start_date, 2));
          },
        },
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'deliveryman_id',
      as: 'deliveryman',
    });
    this.belongsTo(models.Recipient, {
      foreignKey: 'recipient_id',
      as: 'recipient',
    });
    this.belongsTo(models.File, {
      foreignKey: 'signature_id',
      as: 'signature',
    });
  }
}

export default Order;
