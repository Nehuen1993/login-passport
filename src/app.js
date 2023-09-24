const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const MongoStore = require('connect-mongo');
const usersRouter = require('./routes/users.router');
const passport = require("passport")
const initializePassport = require("./config/passport.config");
const cookieParser = require('cookie-parser');




const app = express();

mongoose.connect("mongodb+srv://nehuengiannone:Lz7n3cS0vO7ulfvk@cluster0.s1deur4.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://nehuengiannone:Lz7n3cS0vO7ulfvk@cluster0.s1deur4.mongodb.net/?retryWrites=true&w=majority",
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        ttl: 600,
    }),
    secret: 'coderSecret',
    resave: false,
    saveUninitialized: true,
}));


app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

initializePassport(passport)
app.use(passport.initialize())
app.use(passport.session())
app.use(cookieParser())

app.use('/api/sessions', usersRouter)

app.get('/', (req, res) => {
    res.send('Express Sessions!')
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.listen(8080, () => {
    console.log('Servidor en ejecución en el puerto 8080');
});
