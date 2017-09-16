var express = require('express');
var router = express.Router();
var Book = require("../models").Book;
var Loan = require("../models").Loan;
var moment = require('moment');

const today = moment().format('YYYY[-]MM[-]DD');

/* GET all books */
router.get('/', function(req, res, next) {
  Book.findAll().then(function(books){
    //console.log(books[0].dataValues);
    //console.log(books[1].dataValues);

    let books_arr = books.map(function(item){
      return item.dataValues;
    });

    console.log(books_arr);

    res.render('all_books', {books_arr: books_arr});
  });
});

/* GET overdue Books*/

router.get('/overdue', function(req, res, next) {
  Loan.findAll({
    where: {
      returned_on: null,
      return_by: {
        lt: today
      }
    }
  })
    .then((books_result) => {
  let overdue_books = JSON.stringify(books_result);
  console.log(JSON.parse(overdue_books));
  res.send('a-ok');
  });
});

//where return_by < DATE.now && returned_on == null

module.exports = router;
