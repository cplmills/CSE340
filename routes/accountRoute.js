// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')

// Route to account management page
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildManagementView))

// Route to build the login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Process the login data
router.post(
  "/login", 
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)


// Route to build the registration screen
router.get("/register", utilities.handleErrors(accountController.buildRegistration))

// Route to register a new account
// Process the registration data
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  )

module.exports = router;