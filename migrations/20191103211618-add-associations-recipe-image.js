'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'RecipeImages', // name of Source model
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
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'RecipeImages', // name of Source model
      'recipeId' // key we want to remove
    );
  }
};
