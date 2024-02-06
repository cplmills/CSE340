const utilities = require('../utilities');
const accountModel = require('../models/account-model')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  }
  
/* ****************************************
*  Deliver management view
* *************************************** */
async function buildManagementView(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Process Login
* *************************************** */
// async function processLogin(req, res) {
//     let nav = await utilities.getNav()
//     const { account_email, account_password } = req.body
  
//     const regResult = await accountModel.processLogin(
//       account_email,
//       account_password
//     )
//     if (regResult) {
//       req.flash(
//         "notice",
//         `Congratulations, ${account_firstname}. Login Successful.`
//       )
//       res.status(201).render(".", {
//         title: "Logged In",
//         nav,
//         errors: null,
//       })
//     } else {
//       req.flash("notice", "Sorry, the login failed.")
//       res.status(501).render("account/login", {
//         title: "Login Here",
//         nav,
//         errors: null,
//       })
//     }
//   }

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email,
   })
   return
  }
  try {
    console.log(`checking password: ${account_password} - ${accountData.account_password}`)
    const passme = await bcrypt.compare(account_password, accountData.account_password)
    console.log(`passme: ${passme}`)
    if (passme) {
      delete accountData.account_password
      console.log('creating token')
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      return res.redirect("/account/")
    } else {
      req.flash("notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
       title: "Login",
       nav,
       errors: null,
       account_email,
      })    }
  } catch (error) {
    console.error(error)
    return new Error('Access Forbidden')
  }
 }

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegistration(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      title: "Register a New Account",
      nav,
      errors: null,
    })
  }

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body
  
    // Hash the password before storing
    let hashedPassword
    try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
        title: "Registration",
        nav,
        errors: null,
    })
    }

    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    )

    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you\'re registered ${account_firstname}. Please log in.`
      )
      res.status(201).render("account/login", {
        title: "Login",
        nav,
        errors: null,
      })
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("account/register", {
        title: "Registration",
        nav,
        errors: null,
      })
    }
  }


  module.exports = { buildLogin, buildRegistration, registerAccount, buildManagementView, accountLogin }