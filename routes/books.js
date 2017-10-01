var express = require('express');
var router = express.Router();
var Book = require("../models").Book;
var Loan = require("../models").Loan;
var Patron = require("../models").Patron;
var moment = require('moment');

const date = new Date();
const today = date.toISOString().slice(0,10).replace(/-/g,"-");

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
    }
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
    res.render('book_detail', {book: book, loans: loans});
  })
});

router.post('/update/:id', (req, res, next) => {
  const book_id = req.params.id;

  Book.update({
    title: req.body.title,
    author: req.body.author,
    genre: req.body.genre,
    first_published: req.body.first_published
  }, {
    where: {
      id: book_id
    }
  }).then( () => {
    res.redirect('/books')
  })
})

router.get('/new', (req, res, next) => {
  res.render('new_book');
})

router.post('/new', (req, res, next) => {

  Book.create({
    title: req.body.title,
    author: req.body.author,
    genre: req.body.genre,
    first_published: req.body.first_published
  }).then( () => {
    res.redirect('/books');
  })
});

router.get('/return/:id', (req, res, next) => {
  const bookid = req.params.id

  Loan.update({
    returned_on: today
  }, {
    where: {
      book_id: bookid
    }
  }).then( () => {
    res.redirect('/books')
  })
});

module.exports = router;
