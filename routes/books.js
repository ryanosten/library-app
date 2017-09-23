var express = require('express');
var router = express.Router();
var Book = require("../models").Book;
var Loan = require("../models").Loan;
var Patron = require("../models").Patron;
var moment = require('moment');

const today = moment().format('YYYY[-]MM[-]DD');

/* GET all books */
router.get('/', function(req, res, next) {
  Book.findAll().then(function(books){

    let books_arr = books.map(function(item){
      return item.dataValues;
    });

    res.render('all_books', {books_arr: books_arr});
  });
});

/* GET overdue Books*/

router.get('/overdue', function(req, res, next) {
  Book.findAll({
    include: [
      {
        model: Loan,
        where: {
          returned_on: null,
          return_by: {
            lt: today
          }
        }
      }
    ]
  })
    .then(books => {
      res.render('overdue_books', {books: books});
  });
});

router.get('/checked_books', function(req, res, next) {
  Book.findAll({
    include: [
      {
        model: Loan,
        where: {
          returned_on: null,
          loaned_on: {
            ne: null
          }
        }
      }
    ]
  })
    .then(books => {
      res.render('checked_books', {books: books});
  });
});

router.get('/book_detail', function(req, res, next){
  let book_id = req.query.id;
  console.log(book_id);

  Book.findAll({
    where: {
      id: book_id
    }
  })
    .then(books => {
      console.log(books);
      res.render('book_detail', {books: books})
    })
})

module.exports = router;
