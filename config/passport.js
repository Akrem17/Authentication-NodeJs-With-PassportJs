var mongoose=require('mongoose');
var User=require('../models/User');
var bcrypt=require('bcryptjs');
LocalStrategy = require('passport-local').Strategy;

module.exports=function (passport){
passport.use(new LocalStrategy({usernameField:'username'},(username, password, done) =>{
    User.findOne({ username: username })
        .then( (user)=> {
          
        //matching username
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });//el msg yet7at fi req.flash.error
      }
      
        //matching password
        
        bcrypt.compare(password,user.password,(err,isMatch)=>{
               if (err) throw err;
               if (isMatch){
                   return done(null,user)
               }else{
                   return done(null, false, { message: 'Incorrect password.' });

             }
           });

      
    }).catch(err=>console.log(err))
  }
));

passport.serializeUser((user, done) =>{
    done(null, user.id);
  });
  
  passport.deserializeUser((id, done) =>{
    User.findById(id, (err, user) =>{
      done(err, user);
    });
  });
} 