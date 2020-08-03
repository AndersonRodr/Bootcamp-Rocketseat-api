'use strict';
//Criação e deleção da chave estrangeira 'avatar_id' na tabela 'users'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
        'users',
        'avatar_id',
        {
            type: Sequelize.INTEGER,
            reference: { model:'files', key: 'id' },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
            allowNull: true,
        });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users','avatar_id');
  }
};
