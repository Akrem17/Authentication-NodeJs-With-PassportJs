var express = require('express');
var router = express.Router();
var User = require ('../models/User');
var bcrypt = require('bcryptjs');
var passport=require('passport');
/* GET users listing. */
router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/login',(req,res,next)=>{
  passport.authenticate('local',{
    successRedirect:'/dashboard',
    failureRedirect:'/users/login',
    failureFlash:true
  })(req,res,next);

})
router.get('/logout',(req,res,next)=>{
  req.logout();
  req.flash('success_msg','You are logged out ');
  res.redirect('/users/login');

})


router.get('/signup', function(req, res, next) {
  res.render('signup');
});




router.post('/signup',(req,res,next)=>{
 
 const {name,email,username,password}=req.body;
 let errors=[];
 //bsh tchecki not empty fileds
 if(!name || !email || !username || !password){
   errors.push({msg:" Please Complete All Field !"})
   
 }
//bsh tchecki longeur taa lmdp 

if(password.length<6){
  errors.push({msg:" Passowrd Should Be At Less 6 Caracters ! "})
}
//if there is an error yrendri l page with errors
if (errors.length>0){
  res.render('signup',{
    errors,
    name,
    email,
    username,
    password
  });
}else{
  //userExist
  User.findOne({email:email})
  .then(user=>{
        if(user){
        errors.push({msg:"user exist try to login"});
                  res.render('signup',{
                    errors,
                    name,
                    email,
                    username,
                    password
                  })
      }else{
        User.findOne({username:username})
        .then((usern)=>{
          if (usern){
                errors.push({msg:'Username exists try another Username'})
                res.render('signup',{
                  errors,
                  name,
                  email,
                  username,
                  password
            })
          }else{
                const newUser= new User({
                  name,
                  email,
                  username,
                  password
                }); 
                
                //crypt the password
                bcrypt.genSalt(10,(err,salt)=>{
                  bcrypt.hash(newUser.password,salt,(err,hash)=>{
                    if (err) throw err;
                    //set new user pass
                    newUser.password=hash;

                       //save the new user

                newUser.save()
                .then((newone)=>{

                  req.flash('success_msg','You are successfully registred'); 
                  res.redirect('/users/login');
                  
                })
                .catch((err)=>{console.log(err);
                  
              
              })
                    
                  })
                 
                })
             
          }
        })
        .catch(err=>console.log(err))
        }

  })
  .catch(err=>console.log(err))
 
}
 



})
module.exports = router;
