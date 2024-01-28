// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
// Route to build inventory by classification view
router.get("/login", utilities.handleErrors(accountController.buildLogin))
// Route to build the registration screen
router.get("/register", utilities.handleErrors(accountController.buildRegistration))
// Route to register a new account
router.post('/register', utilities.handleErrors(accountController.registerAccount))


module.exports = router;