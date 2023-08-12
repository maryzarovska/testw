const LocalStrategy = require('passport-local').Strategy;
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcrypt');

const config = require('../config');

const initialize = (passport, getUserByUsername, save) => {
    const register = async (username, password, done) => {
        const user = await getUserByUsername(username);

        if (user !== null) {
            return done(null, user, { message: "You are already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            username: username,
            password: hashedPassword
        };

        save(newUser);

        return done(null, newUser, {
            message: "Registration Successful"
        });
    }

    const login = async (username, password, done) => {
        try {
            console.log(username, password);

            const user = await getUserByUsername(username);

            console.log(user);
            
            if (!user) {
                return done(null, false, { message: 'User not found' });
            }

            const validate = await bcrypt.compare(password, user.password);

            console.log(validate);

            if (!validate) {
                return done(null, false, { message: 'Wrong Password' });
            }

            return done(null, user, { message: 'Logged in Successfully' });
        } catch (error) {
            return done(error);
        }
    }

    const validateToken = async (token, done) => {
        try {
            return done(null, token.user);
        } catch (error) {
            done(error);
        }
    }

    passport.use('local-signup', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    }, register));

    passport.use('login', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    }, login));

    passport.use(new JWTstrategy({
        secretOrKey: config.jwtSecret,
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
    }, validateToken));
}

module.exports = initialize;
