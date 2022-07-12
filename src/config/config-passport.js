const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const bcrypt = require('bcrypt');

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(_id, done) {
  User.findById(_id, function(err, user) {
    done(err, user);
  }).lean();
});

passport.use(new LocalStrategy({usernameField: 'email'},
  function(email, password, done) {
    User.findOne({ email: email }, async function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect email or second name.' });
      }
      if (!(await bcrypt.compare(password, user.password))) {
        return done(null, false, { message: 'Incorrect password.' });
      } 
      return done(null, user);
    }).lean();
  }
));