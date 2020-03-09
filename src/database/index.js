import Sequelize from 'sequelize';

import User from '../app/models/User';
import File from '../app/models/File';
import Deliveryman from '../app/models/Deliveryman';
import databaseConfig from '../config/database';
import Recipient from '../app/models/Recipient';
import Delivery from '../app/models/Delivery';

const models = [User, Recipient, File, Deliveryman, Delivery];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
