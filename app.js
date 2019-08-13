const express = require('express');
const bodyParser = require('body-parser');

const greetings = require('./lib/greetings');
const credentials = require('./credentials');

const app = express();

// Disable x-powered-by header in the response object
app.disable('x-powered-by');

// Handlebars view engine
var handlebars = require('express-handlebars').create({ defaultLayout:'main' });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// Static folder
app.use(express.static(__dirname + '/public'));

// Use body-parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Use cookie-parser
app.use(require('cookie-parser')(credentials.cookieSecret));

// Port number
const PORT = 3000;
app.set('port', process.env.PORT || PORT);

// Locals available to all routes; Setting the partials context
app.use((req, res, next) => {
    if(!res.locals.partials)
        res.locals.partials = {};
    res.locals.partials.serverHi = greetings.getRandomGreeting();
    next();
});

// Routes
app.get('/', (req, res) => {
    res.render('home');
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/forms', (req, res) => {
    res.render('forms');
});

// Cookie Routes (implicit wildcard at the end of the route)
app.get('/cookies', (req, res) => {
    res.cookie('testCookie', 'This is a test cookie', { signed: true, httpOnly: true });
    res.type('text/plain');
    res.send('Cookies are sweet!');
});

// Not the best solution? (back button can go to form result?)
app.post('/colors', (req, res) => {
    res.render('colors', {
        name: req.body.name,
        color: req.body.color
    });
});

// More routes
app.get('/redirectme', (req, res) => {
    res.redirect('/about');
});

app.get('/text', (req, res) => {
    res.set('Content-Type', 'text/plain');
    // or res.set('text/plain);
    res.send('This is just plain text.');
});

app.get('/download', (req, res) => {
    res.download('./public/favicon.ico');
});

// Custom 404 page
app.use((req, res) => {
    res.status(404);
    res.render('404');
});

// Custom 500 page
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

// Server start
app.listen(app.get('port'), () => {
    console.log(`Running server on port ${app.get('port')}...`);
});
