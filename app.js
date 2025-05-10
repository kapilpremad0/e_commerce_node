const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');

const app = express();




const session = require('express-session');

app.use(session({
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: true,
}));

app.use((req, res, next) => {
  res.locals.success = req.session.success || null;
  delete req.session.success;

  res.locals.error = req.session.error || null;
  delete req.session.error;
  next();
});


// Database Connection
mongoose.connect("mongodb+srv://sharmajiyashu:P56JdPgzSlDtHtCw@cluster0.ijnrya1.mongodb.net/ecommerce?retryWrites=true&w=majority", {
    // useNewUrlParser and useUnifiedTopology not needed in latest mongoose
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log('DB Error:', err));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// EJS Layouts
app.use(expressLayouts);
app.set('layout', 'admin/layouts/app');

app.use((req, res, next) => {
    res.locals.currentRoute = req.originalUrl; // or req.path if you prefer
    next();
  });



app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes
app.use('/admin/categories', require('./routes/admin/categoryRoutes'));
app.use('/admin', require('./routes/admin/homeRoutes'));
app.use('/admin/products', require('./routes/admin/productRoutes'));

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
