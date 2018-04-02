const express = require('express');
const path = require('path');
const exphbs  = require('express-handlebars');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const connectFlash = require('connect-flash');
const methodOverride = require('method-override');
const app = express();

// Load database
const db = require('./config/database');
// Load routes
const ideas  = require('./routes/ideas');
const users = require('./routes/users');

// Passport Config
require('./config/passport')(passport);
// Connect to mongoose
mongoose.connect(db.mongoURI)
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log(err));

// Load Idea Model
require('./models/Idea');
const Idea = mongoose.model('ideas');

// Handlebars middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(methodOverride('_method'));
// Express session middleware
app.use(expressSession({
    secret: 'secret',
    resave: true,
    saveUninitialized: false
  }))

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
app.use(connectFlash());

// Global variables for flash messages

app.use(function(req,res,next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
})
// App index route
app.get('/', (req,res) => {
const title = `Hello World, it's Zain`;
res.render('index', {
    title: title
});
});

// About Route
app.get('/about', (req,res) => {
    res.render('about');
});

app.use('/ideas', ideas);

app.use('/users', users);
const port = process.env.PORT || 5000;

app.listen(port, () =>{
    console.log(`Server started on port ${port}`);
});