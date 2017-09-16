'use strict';

module.exports = function(sequelize, DataTypes) {
  var Loan = sequelize.define('Loan', {
    book_id: DataTypes.INTEGER,
    patron_id: DataTypes.INTEGER,
    loaned_on: DataTypes.DATE,
    return_by: DataTypes.DATE,
    returned_on: DataTypes.DATE
  }, {
    timestamps: false,
  });
  Loan.associate = function(models) {
    Loan.belongsTo(models.Book, { foreignKey: 'book_id', as: 'book' });
    Loan.belongsTo(models.Patron, { foreignKey: 'patron_id', as: 'patron'})
  }
  return Loan;
};
