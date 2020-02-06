'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all(
      [
        queryInterface.addColumn(
          'Favorite_Recipes', // name of Source model
          'recipeId', // name of the key we're adding 
          {
            type: Sequelize.INTEGER,
            references: {
              model: 'Recipes', // name of Target model
              key: 'id', // key in Target model that we're referencing
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
          }
        ),
        queryInterface.addColumn(
          'Favorite_Recipes', // name of Source model
          'userId', // name of the key we're adding 
          {
            type: Sequelize.INTEGER,
            references: {
              model: 'Users', // name of Target model
              key: 'id', // key in Target model that we're referencing
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
          }
        )

      ]
    );
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn(
        'Favorite_Recipes', // name of Source model
        'recipeId' // key we want to remove
      ),
      queryInterface.removeColumn(
        'Favorite_Recipes', // name of Source model
        'userId' // key we want to remove
      )
    ]);
  }
};

