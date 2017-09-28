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
  const querystring = req.query.id;

  const bookData = Book.findAll({
    where: {
      id: querystring
    }/*,
    include: [
      {
        model: Loan,
        where: {
          book_id: querystring
        }
      }
    ]*/
  });

  const loanData = Loan.findAll({
    where: {
      book_id: querystring
    },
    include:[
      {
        model: Patron,
        as: 'patron'
      }
    ]
  });

  Promise.all([
    bookData,
    loanData
  ]).then(data => {
    var book = data[0][0];
    var loans = data[1];
    console.log(book);
    console.log(loans);
    res.render('book_detail', {book: book, loans: loans});
  })
/*
    .then(book => {
      book = book[0]
      console.log(JSON.stringify(book));
      let loans = book.Loans;
      console.log(JSON.stringify(loans));
      res.render('book_detail', {book: book, loans: loans})
    })
    */
})

module.exports = router;
