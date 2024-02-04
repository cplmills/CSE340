/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const baseController = require("./controllers/baseController")
const express = require("express")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const expressLayouts = require("express-ejs-layouts")
const inventoryRoute = require("./routes/inventoryRoute")
const accountRoute = require("./routes/accountRoute")
const utilities = require("./utilities")
const session = require("express-session")
const pool = require('./database/')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

/* ***********************
 * Middleware
 * ************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) //for parsing an application/x-www-form-urlencoded
app.use(cookieParser())
/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root


/* ***********************
 * Routes
 *************************/
app.use(static)
// Index Route

app.get ("/", utilities.handleErrors(baseController.buildHome))
app.use("/inv", inventoryRoute)
app.use("/account", accountRoute)

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({
    status: 404, 
    message: '<h2>Sorry, we appear to have lost that page.</h2><img class="errorimg" src="../../images/errors/404.jpg">'
  })
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  let err_html = ''
  
  // if there is a stack, display it
  try {
    let err_lines = err.stack.split('\n')
    err_html = err_lines.map(line => '<p class="errortext">'+line+'</p>').join('')
  } catch {
    err_html = ''
  }
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status === 404){ 
    message = err.message
  } else {
    message = '<h2 class="errormsg">Oh no! There was a crash.</h2><img class="errorimg" src="../../images/errors/500.jpg"><p class="errorbody">Maybe try a different route?</p><p class="errortext">'+ err_html + '</p>'
  }
  let title = err.status || 'Server Error'
  res.render("errors/error", {
  title,
  message,
  nav
  })
})
