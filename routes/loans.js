var express = require('express');
var router = express.Router();
var Loan = require("../models").Loan;
var Book = require("../models").Book;
var Patron = require("../models").Patron;
var moment = require("moment")

const today = moment().format('YYYY[-]MM[-]DD');

/* GET all books */
router.get('/', function(req, res, next) {
  Loan.findAll({
    include: [
      {
        model: Book,
        as: 'book'
      },
      {
        model: Patron,
        as: 'patron'
      }
    ]
}).then(function (loans) {

    res.render('all_loans', {loans_arr: loans});
  });
});

router.get('/all', function(req, res, next) {
  Loan.findAll({
    include: [
      {
        model: Book,
        as: 'book'
      },
      {
        model: Patron,
        as: 'patron'
      }
    ]
}).then(loans => {

    res.render('all_loans', {loans_arr: loans});
  });
});

router.get('/overdue', function(req, res, next) {
  Loan.findAll({
    where: {
      returned_on: null,
      return_by: {
        lt: today
        }
    },
    include: [
      {
        model: Book,
        as: 'book',
      },
      {
        model: Patron,
        as: 'patron'
      },
    ]
  })
    .then(overdue_loans => {
      res.render('overdue_loans', {loans: overdue_loans});
  });
});


router.get('/checked_loans', function(req, res, next) {
  Loan.findAll({
    where: {
      returned_on: null,
      },
    include: [
      {
        model: Book,
        as: 'book',
      },
      {
        model: Patron,
        as: 'patron'
      },
    ]
  })
    .then(checked_loans => {
      res.render('checked_loans', {checked_loans: checked_loans});
  });
});




module.exports = router;
