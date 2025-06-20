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
//     await queryInterface.addColumn('users', 'name', {
//       type: Sequelize.STRING,
//       allowNull: false,
//       defaultValue: '',
//     });
//     await queryInterface.addColumn('users', 'surname', {
//       type: Sequelize.STRING,
//       allowNull: false,
//       defaultValue: '',
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
//   }
// };
