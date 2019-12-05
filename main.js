const express = require('express');
const session = require('express-session');
const flash = require('express-flash')
const bodyParser = require('body-parser');
const allRouter = require('./routes/routes');
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.set('trust proxy', 1); // trust first proxy
app.use(session({
    secret: 'sessionTesting',
    resave: true,
    saveUninitialized: true
}));
app.use(flash());

app.use('/', allRouter);

app.listen(3000, function() {
    console.log("App listening post 3000");
});