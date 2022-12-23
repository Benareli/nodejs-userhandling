const passport =require("passport")
const GoogleStrategy = require('passport-google-oauth2').Strategy;

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
        done(null, user);
});

passport.use(new GoogleStrategy({
        clientID:"460039993645-pi2hl7pglp05t6am6j13nl6o0fgjmijc.apps.googleusercontent.com",
        clientSecret:"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",
        callbackURL: "http://localhost:9000/google/callback",
        passReqToCallback   : true
    },
    function(request, accessToken, refreshToken, profile, done) {
            return done(null, profile);
    }
));