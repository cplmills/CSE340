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
  let accountData = res.locals.accountData
  let headingCode = ''
  let updateLink = ''
  updateLink += `<a title="Update Account Information" href="/account/update/${accountData.account_id}">Update Account Information</a>`
  let loggedInAs = accountData.account_type.toLowerCase()
  if (loggedInAs === "client"){
    headingCode += `<h2>Welcome ${res.locals.accountData.account_firstname}</h2>`
  } else if (loggedInAs === "admin" || loggedInAs === "employee"){
    headingCode += `<h2>Welcome ${accountData.account_firstname}</h2>`
    updateLink += `<h2>Inventory Management</h2>`
    updateLink += `<a title="Manage Inventory" href="/inv/">Manage Inventory</a>`
  }
  let content = headingCode + updateLink
  res.render("account/management", {
    title: "Account Management",
    content,
    nav,
    errors: null,
  })
}

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

/* ****************************************
*  Deliver update view
* *************************************** */
async function buildUpdateAccount(req, res, next) {
  let nav = await utilities.getNav()
  //res.locals.accountData = await accountModel.getAccountByEmail(res.locals.accountData.account_email)
  res.locals.accountData = await accountModel.getAccountByID(res.locals.accountData.account_id)
  res.render("account/update", {
    title: "Update Account",
    nav,
    accountdata: res.locals.accountData,
    errors: null,
  })
}

/* ****************************************
*  Process Account Update
* *************************************** */
async function updateAccount(req, res) {
  let nav = await utilities.getNav()
  let accountdata = res.locals.accountData
  const { account_id, account_firstname, account_lastname, account_email } = req.body
  // if the details form is submitted
  if (req.body.account_lastname) {
    let checkEmail = accountdata.account_email === account_email ? false : true
    console.log(`Information Form Submitted: Email changed: ${checkEmail}`)
    // if the email field has been changed and the selected email already exists
    if (checkEmail && accountModel.checkExistingEmail(accountdata.account_email)) {
      console.error("Account exists already")
      res.locals.accountData.account_email = account_email
      req.flash("notice", 'Sorry, that email address is already in use.')
      res.redirect("/account")

    // if email field has changed and new email is not in use
    } else {
      const regResult = await accountModel.updateAccount(
        account_id,
        account_firstname,
        account_lastname,
        account_email,
      )
      if (regResult) {
        req.flash(
          "notice",
          `Information Successfully Updated`
        )
        res.redirect("/account/")

      } else {
        req.flash("notice", 'Sorry, there was an error processing the update.')
        res.status(500).render(`account/`, {
          title: "Update Account Failed",
          nav,
          accountdata: res.locals.accountData,
          errors: null,
      })
      }
    }
  }
}

async function updatePassword(req, res) {
  let nav = await utilities.getNav()
  let accountdata = res.locals.accountData

  const { account_id, account_password } = req.body
  if (req.body.account_password) {
    console.log("Password Form Submitted")
 
    // Hash the password before storing    
    let hashedPassword
    try {
      // regular password and cost (salt is generated automatically)
      hashedPassword = await bcrypt.hashSync(req.body.account_password, 10)
      console.error(`HP: ${hashedPassword} - AP: ${req.body.account_password}`)
    } catch (e) {
      console.error(e)
    }
      regResult = await accountModel.changePassword(hashedPassword, account_id)
      if (regResult) {
        req.flash(
          "notice",
          `Password Successfully Updated`
        )
        res.status(201).redirect("/account/")
      } else {
        req.flash("notice", 'Sorry, there was an error processing the password update.')
        res.status(500).render(`account/`, {
            title: "Registration",
            nav,
            accountdata,
            errors: null,
        })
      }
  }
}

/* ****************************************
*  Process Logout
* *************************************** */
async function logOut(req, res) {
  let nav = await utilities.getNav()
  res.clearCookie('jwt', { httpOnly: true })
  req.flash("notice", 'Logout Successful, Thank You!')
  res.redirect("/")
}





  module.exports = { buildLogin, buildRegistration, registerAccount, buildManagementView, accountLogin, buildUpdateAccount, updateAccount, updatePassword, logOut }