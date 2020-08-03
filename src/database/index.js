import Sequelize from 'sequelize';
import mongoose from 'mongoose';

import User from '../app/models/User';
import File from '../app/models/File';
import Appointment from '../app/models/Appointment';

import databaseConfig from '../config/config';

const models = [User, File, Appointment];

class Database{
    constructor(){
        this.init();
        this.mongo();
    }

    init(){
        this.connection = new Sequelize(databaseConfig);

        //Adicionando acesso à conexão a todos os models do sistema
        //Verificação se algum model possui inclusão de chave estrangeira em sua tabela
        models
        .map(model => model.init(this.connection))
        .map(model => model.associate && model.associate(this.connection.models));
    }
    mongo(){
        this.mongoConnection = mongoose.connect(
            process.env.MONGO_URL,
            { useNewUrlParser: true, useFindAndModify: true, useUnifiedTopology: true }
        );
    }
}

export default new Database();
