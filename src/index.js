const Sequelize = require('sequelize');

import { listFiles } from './util/listFiles'

class SequelizeWrapper {
  models = {};
  constructor() {}
  
  connect(connectionData) {
    this.connection = new (Sequelize.bind.apply(Sequelize, arguments))();
    return this;
  }

  loadModels(paths) {
    if(!this.connection) throw new Error('Sequelize has not been connected to database, call connect() first!');
    if(Object.prototype.toString.call(paths) !== '[object Array]' ) {
      paths = [ paths ];
    }
    let fileList = [];
    paths.forEach(_path => {
      listFiles(_path).forEach(modelFile => {
        const model = this.connection.import(modelFile);
        this.models[model.name] = model;
      });
    });
    Object.keys(this.models).forEach(modelName => {
      if("associate" in this.models[modelName])
        this.models[modelName].associate(this.models);
    });
    return this;
  }

  model(name) {
    return this.models[name];
  }
}

let sequelizeInstance = new SequelizeWrapper();
sequelizeInstance.initializer = SequelizeWrapper;

module.exports = sequelizeInstance;
