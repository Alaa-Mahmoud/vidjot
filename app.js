const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const path = require('path');
const app = express();
const passport = require('passport');
const DBConfig = require('./config/database');

const PORT = process.env.PORT || 3000;
// map global promise 
mongoose.Promise = global.Promise;

//connect to mongoose
mongoose.connect(DBConfig.mongoURI, {
    useMongoClient: true,
}).then(() => {
    console.log('MongoDB connected');
}).catch((e) => { console.log(e); });


//load routes 
const ideas = require('./routes/idea');
const users = require('./routes/user');

require('./config/passport')(passport);
// app Middleware
app.engine('handlebars', exphbs({
    defaultLayout: "main"
}));
app.set('view engine', 'handlebars');
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
/**global variables */
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

app.use('/ideas', ideas);
app.use('/users', users);

// static folder 
app.use(express.static(path.join(__dirname, 'public')));


/****************************
 *  here we put routes
 ****************************/
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/about', (req, res) => {

    res.render('about');
});





/*************************
 * listining to the server
 *************************/
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});