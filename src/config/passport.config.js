const passport = require("passport");
const local = require("passport-local");
const userService = require("../models/User");
const { isValidatePassword } = require("../../utils");
const GitHubStrategy = require("passport-github2")
const jwt = require("passport-jwt")
const bcrypt = require("bcrypt"); 


const localStrategy = local.Strategy;

const initializePassport = () => {
    passport.use(
        "register",
        new localStrategy(
            { passReqToCallback: true, usernameField: "email" },
            async (req, username, password, done) => {
                const { first_name, last_name, email, age } = req.body;
                try {
                    let user = await userService.findOne({ email: username });
                    if (user) {
                        console.log("El usuario ya existe");
                        return done(null, false);
                    }

                    if (!first_name || !last_name || !email || !age || !password) {
                        
                        console.log("Faltan campos obligatorios");
                        return done(null, false);
                    }

                    const newUser = {
                        first_name,
                        last_name,
                        email,
                        age,
                        password: await bcrypt.hash(password, 10), 
                    };
                    let result = await userService.create(newUser);
                    return done(null, result);
                } catch (error) {
                    return done("Error al obtener el usuario " + error);
                }
            }
        )
    )



    passport.serializeUser((user, done) => {
        done(null, user._id);
    })

    passport.deserializeUser(async (id, done) => {
        let user = await userService.findById(id);
        done(null, user);
    })

    passport.use(
        "login",
        new localStrategy({ usernameField: "email" }, async (username, password, done) => {
            try {
                const user = await userService.findOne({ email: username });
                if (!user) {
                    return done(null, false);
                }
               

                if (!isValidatePassword(password, user.password)) { 
                    return done(null, false);
                }

                return done(null, user);
            } catch (error) {
                return done(error);
            }
        })
    );
}

// const cookieExtractor = req => {
//     let token = null
//     if (req && req.cookies) {
//         token = req.cookies["coderCookieToken"]
//     }
//     return token
// }

// const JWTStrategy = jwt.Strategy
// const ExtractJWT = jwt.ExtractJwt

// const initializePassport = () => {
//     passport.use("jwt", new JWTStrategy({
//         jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
//         secretOrKey: "coderSecret"
//     }, async (jwt_payload, done) => {
//         try {
//             return done(null, jwt_payload)
//         } catch (err) {
//             return done(err)
//         }
//     }
//     ))
// }

module.exports = initializePassport;