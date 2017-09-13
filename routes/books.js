var express = require('express');
var router = express.Router();
var Book = require("../models").Book;

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

module.exports = router;
