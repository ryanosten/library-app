var express = require('express');
var router = express.Router();
var Loan = require("../models").Loan;
var Book = require("../models").Book;
var Patron = require("../models").Patron;

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

    let loans_json = JSON.stringify(loans);

    console.log(loans_json);

    loans_arr = JSON.parse(loans_json);

    res.render('all_loans', {loans_arr: loans_arr});
  });
});

module.exports = router;
