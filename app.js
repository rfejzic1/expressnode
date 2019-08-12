const express = require('express');
const greetings = require('./lib/greetings');

const app = express();

// Disable x-powered-by header in the response object
app.disable('x-powered-by');

// Handlebars view engine
var handlebars = require('express-handlebars').create({ defaultLayout:'main' });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// Static folder
app.use(express.static(__dirname + '/public'));

// Port number
const PORT = 3000;
app.set('port', process.env.PORT || PORT);

// Routes
app.get('/', (req, res) => {
    const serverHi = greetings.getRandomGreeting();
    res.render('home', { serverHi });
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/redirectme', (req, res) => {
    res.redirect('/about');
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
