const LocalStrategy = require('passport-local').Strategy;
const bcryptjs = require('bcryptjs');
const mongoose = require('mongoose');

// Load user model
const User = mongoose.model('users');

module.exports = function (passport) {
    passport.use(new LocalStrategy({ usernameField: 'mail' }, (mail, password, done) => {
        User.findOne({
            email: mail
        })
            .then(user => {
                if (!user) {
                    return done(null, false, { message: 'No user found' });
                } 
                // Match Password
                bcryptjs.compare(password, user.password, (err,decrypt) =>{
                    if (err) throw err;
                    if(decrypt){
                        return done(null, user);
                    } else{
                        return done(null,false, {message: 'Password Incorrect'});
                    }
                })
            })
    }));
    
    passport.serializeUser((user,done)=>{
        done(null,user.id);
    });

    passport.deserializeUser((id,done)=> {
        User.findById(id, (err,user) => {
            done(err,user);
        })
    })
}