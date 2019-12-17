module.exports=

    function ensureauthenticated (req,res,next){
        if(req.isAuthenticated()){
            return next();
        }
        
        req.flash('error_msg','please log in first');
        res.redirect('/users/login');
    }
