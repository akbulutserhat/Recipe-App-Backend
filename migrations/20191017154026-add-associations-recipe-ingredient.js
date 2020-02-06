'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all(
      [
        queryInterface.addColumn(
          'Recipe_Ingredients', // name of Source model
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
          'Recipe_Ingredients', // name of Source model
          'ingredientId', // name of the key we're adding 
          {
            type: Sequelize.INTEGER,
            references: {
              model: 'Ingredients', // name of Target model
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
        'Recipe_Ingredients', // name of Source model
        'recipeId' // key we want to remove
      ),
      queryInterface.removeColumn(
        'Recipe_Ingredients', // name of Source model
        'ingredientId' // key we want to remove
      )
    ])
  }
};
