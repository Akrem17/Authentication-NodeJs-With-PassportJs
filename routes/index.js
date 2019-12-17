var express = require('express');
var router = express.Router();
 var ensureAuthenticated =require('../config/auth');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('welcom');
});

router.get('/dashboard' ,ensureAuthenticated, (req, res)=> res.render('dashBoard',{
  name:req.user.name
}));


module.exports = router;
