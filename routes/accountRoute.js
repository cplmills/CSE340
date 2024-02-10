// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')

// Route to account management page
//router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildManagementView))
router.get("/", (req, res, next) => utilities.checkLogin(req, res, next, ['admin', 'employee', "client"]), utilities.handleErrors(accountController.buildManagementView));

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
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Route to build the update account details screen
router.get("/update/:account_id", 
(req, res, next) => utilities.checkLogin(req, res, next, ['admin', 'employee', "client"]),
utilities.handleErrors(accountController.buildUpdateAccount))

// Route to update account details
router.post(
  "/update",
  (req, res, next) => utilities.checkLogin(req, res, next, ['admin', 'employee', "client"]),
  regValidate.updateRules(),
  regValidate.checkUpdateData,
utilities.handleErrors(accountController.updateAccount)
)

// Route to update account password
router.post(
  "/updatepassword",
  (req, res, next) => utilities.checkLogin(req, res, next, ['admin', 'employee', "client"]),
  regValidate.passwordRules(),
  regValidate.checkPasswordData,
  utilities.handleErrors(accountController.updatePassword)
)

// Route to logout account
router.get(
  "/clear-cookie",
  utilities.handleErrors(accountController.logOut)
)
module.exports = router;