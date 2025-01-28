import { Router } from "express";
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import User from '../../../db/models/userModel.js'
import dotenv from 'dotenv';

const router = Router();
dotenv.config();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS.split(',')[0]

passport.use(new GoogleStrategy({
    clientID:     GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: GOOGLE_CALLBACK_URL,
    passReqToCallback   : true
  },
  async function(request, accessToken, refreshToken, profile, done) {
    let user = await User.findOne({ googleId: profile.id });
    
    if (!user) {
      user = await User.create({
        googleId: profile.id,
        email: profile.email,
        displayName: profile.displayName,
        storageBaseUrl: `${profile.id}/files`
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
  req.user ? res.status(200).json({ authenticated: true }) : res.status(200).json({ authenticated: false });
});

router.get('/google', 
  passport.authenticate('google', {scope: ['email', 'profile']})
);

router.get('/protected', isLoggedIn, (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.redirect(`${ALLOWED_ORIGINS}/home`);
});

router.get('/loggedin',
  passport.authenticate('google', {
    successRedirect: '/auth/protected',
    failureRedirect: '/auth/failure',
  })
);

router.get('/failure', (req, res) => {
  res.redirect(`${ALLOWED_ORIGINS}/login`);
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