import { Router } from "express";
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import User from '../../../db/models/userModel.js'

const router = Router();

const GOOGLE_CLIENT_ID = ''
const GOOGLE_CLIENT_SECRET = ''

passport.use(new GoogleStrategy({
    clientID:     GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/loggedin",
    passReqToCallback   : true
  },
  async function(request, accessToken, refreshToken, profile, done) {
    // User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //   return done(err, user);
    // });
    let user = await User.findOne({ googleId: profile.id });
    
    if (!user) {
      // If the user doesn't exist, create a new user
      user = await User.create({
        googleId: profile.id,
        email: profile.email,
        // displayName: profile.displayName
      });
    }
    return done(null, profile);
  }
));

passport.serializeUser(function(user, done){
    done(null, user);
});

passport.deserializeUser(function(user, done){
    done(null, user);
});
function isLoggedIn(req, res, next){
  req.user ? next() : res.sendStatus(401);
};

router.get('/status', (req, res) => {
  req.user ? res.status(200).json({ authenticated: true, user: req.user }) : res.status(401).json({ authenticated: false });
});

router.get('/google', 
  passport.authenticate('google', {scope: ['email', 'profile']})
);

router.get('/protected', isLoggedIn, (req, res) => {
  // console.log(req.user)
  res.set('Cache-Control', 'no-store');
  res.redirect('http://localhost:8080/drive');
});

router.get('/loggedin',
  passport.authenticate('google', {
    successRedirect: '/auth/protected',
    failureRedirect: '/auth/failure',
  })
);

router.get('/failure', (req, res) => {
  res.redirect('http://localhost:8080/login');
});

router.get('/logout', isLoggedIn, (req, res) => {
  req.logout(err => {
    if (err) {
      console.log(err); 
    }
    res.clearCookie('connect.sid');
      res.set('Cache-Control', 'no-store'); 
    req.session.destroy();
    res.status(200).json({ redirectUrl: '/login' });

  });
});

export default router;