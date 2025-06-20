// npx sequelize-cli migration:generate --name remove-role-from-workplaces
// npx sequelize-cli db:migrate
// npx sequelize-cli db:migrate:undo

// 'use strict';
//
// /** @type {import('sequelize-cli').Migration} */
// module.exports = {
//   async up (queryInterface, Sequelize) {
//     /**
//      * Add altering commands here.
//      *
//      * Example:
//      * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
//      */
//     await queryInterface.addColumn('workplaces', 'radius', {
//       type: Sequelize.INTEGER,
//       defaultValue: 20,
//       allowNull: false,
//     });
//   },
//
//   async down (queryInterface, Sequelize) {
//     /**
//      * Add reverting commands here.
//      *
//      * Example:
//      * await queryInterface.dropTable('users');
//      */
//     await queryInterface.removeColumn('workplaces', 'radius');
//   }
// };
