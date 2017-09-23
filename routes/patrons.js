var express = require('express');
var router = express.Router();
var Book = require("../models").Book;
var Loan = require("../models").Loan;
var Patron = require("../models").Patron;

/* GET all patrons*/

router.get('/', function(req, res, next) {
  Patron.findAll()
    .then(patrons => {
      console.log(patrons);
      res.render('all_patrons', {patrons: patrons})
      //res.render('all_patrons', {patrons: patrons});
  });
});

module.exports = router;
