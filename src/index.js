// ****************************************************************************************
// Server Main File
// ****************************************************************************************


// Libs
const path = require('path');

// Server
const express = require('express');
const morgan = require('morgan');
const app = express();

// Database
const flash = require('connect-flash');
const session = require('express-session');
const MySQLStore = require('express-mysql-session');
const { database } = require('./keys');

// Frontend
const { engine } = require('express-handlebars');


// ****************************************************************************************
// Configuraciones
// ****************************************************************************************


// Puerto
app.set('port', process.env.PORT || 4000);

// Directorio de vistas
app.set('views', path.join(__dirname, 'views'));

// Motor de vistas
app.engine('.hbs', engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');

// Middleweares
app.use(session({
    secret: 'productsmysqlnodesession',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
}));

app.use(flash());

app.use(morgan('dev'));

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

// Variables Globales
app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    next();
});


// ****************************************************************************************
// Rutas
// ****************************************************************************************


app.use(require('./routes'));

// Productos
app.use("/products",require('./routes/products'));

// Inicio
app.use(express.static(path.join(__dirname, 'public')));


// ****************************************************************************************
// Servidor
// ****************************************************************************************


app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});