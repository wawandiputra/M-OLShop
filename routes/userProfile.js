var express = require('express');
var router = express.Router();

var mongoose = require( 'mongoose' );
var User = mongoose.model('User');
var bCrypt = require('bcrypt-nodejs');

//Used for routes that must be authenticated.
function isAuthenticated (req, res, next) {
    // if user is authenticated in the session, call the next() to call the next request handler 
    // Passport adds this method to request object. A middleware is allowed to add properties to
    // request and response objects

    //allow all get request methods    
    //if(req.method === "GET"){
    //    return next();
    //}
    if (req.isAuthenticated()){
        return next();
    }

    // if the user is not authenticated then redirect him to the login page
    return res.redirect('/#login');
};

//Register the authentication middleware
router.use('/', isAuthenticated);

//api for a specfic post
router.route('/:id')
    //gets specified post
    .get(function(req, res){       
        User.findById(req.param('id'), function(err, post){
            if(err)
                res.send(err);
            res.json(post);
        });

    })   
    .put(function(req, res) {
           User.findById(req.param('id'), function(err, user){            
                
                user.username = req.body.username;
                user.firstname = req.body.firstname;
                user.lastname = req.body.lastname;
                user.shippingAddress = req.body.shippingAddress;
                user.billingAddress = req.body.billingAddress;
                console.log(req.body.billingAddr);
                console.log(user.BillingAddr);
            
                user.email = req.body.email;
                user.password = createHash(req.body.password);               
                user.save(function(err, user){
                    if(err)                        
                        res.send({state: 'failure', user:user, message: "Failed to update profile"});

                    res.send({state: 'success', user:user, message: "Profile updated successfully"});
                });
                
            });
        });

router.route('/changePassword/:id')
    .put(function(req, res) {
           User.findById(req.param('id'), function(err, user){            
                console.log(user.password);
                if (!isValidPassword(user, req.body.password)){
                            console.log('Invalid Password');
                            res.send({state: 'failure', user:user, message: "Invalid username or password"});
                }          
                else{
                    user.username = req.body.username;
                    user.password = createHash(req.body.newPassword);               
                    user.save(function(err, user){
                        if(err)
                            res.send(err);

                        res.json(user);
                    });
                }
            });
        });



   

    var isValidPassword = function(user, password){
        return bCrypt.compareSync(password, user.password);
    };
    // Generates hash using bCrypt
    var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    };

module.exports = router;
    