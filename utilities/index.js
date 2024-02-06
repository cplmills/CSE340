const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* *************************************/
Util.buildClassificationGrid = async function(data){
  let grid = ""
  if(data.length > 0){
    grid += '<div id="inv-container">'
    data.forEach(vehicle => { 
      let link = '../../inv/detail/' + vehicle.inv_id
      grid += '<div class="inv-display" id="inv' + vehicle.inv_id + '">'
      grid += '<a href="'+link
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span class="price">$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</div>'
    })
    grid += '</div>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the inventory view HTML
* ************************************ */
Util.buildInventoryItem = async function(invitem){
  let item = ""
  if(invitem.length > 0){
    let data = invitem[0]
      item += '<div id="invWrapper">'
      item += '<div id="invItem_Image">'
      item +=  '<img src="' + data.inv_image 
      +'" class="polaroid" alt="Image of '+ data.inv_color + ' ' + data.inv_make + ' ' + data.inv_model 
      +' on CSE Motors" /></div>'
      
      item += '<div id="invItem_Details">'
      item += '<h2>'
      item += data.inv_year + " - " + data.inv_make + ' ' + data.inv_model + ' - ' + data.inv_color 
      item += '</h2>'
      item += '<p>' + data.inv_description + '</p>'

      item += '<p><b>Make          :</b> ' + data.inv_make + '</p>'
      item += '<p><b>Model         :</b> ' + data.inv_model + '</p>'
      item += '<p><b>Year          :</b> ' + data.inv_year + '</p>'
      item += '<p><b>Milage        :</b> ' + data.inv_miles.toLocaleString() + '</p>'
      item += '<p><b>Color         :</b> <span style="display: inline-block; border: 1px solid black; width: 16px; background-color: ' + data.inv_color + ';">&nbsp</span> ' + data.inv_color + '</p>'
      item += '<p class="price">$' + new Intl.NumberFormat('en-US').format(data.inv_price) + '</p>'
      item += '</div>'

      item += '</div>'

  } else { 
    item += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return item
}

/* **************************************
* Build the Managment view HTML
* *************************************/
// Util.buildManagementView = async function(){
  // let body = '<div class="center-container">'
  // body += '<div class="form-container">'
  // body += '<a href="/inv/add-classification">Add Classification</a>'
  // body += '<br><a href="/inv/add-inventory">Add Inventory Item</a>'
  // body += '<h2>Manage Inventory</h2>'
  // body += '<p>Select a classification from the list below to see items belonging to that classification.</p>'
  // <%- classificationSelect %>
  // body += '</div>'
  // body += '</div>'
  // return body
// }

/* **************************************
* Build the categories dropdown
* *************************************/
Util.buildClassificationList = async function buildClassificationList(activeItem = null) {
  let classList = await invModel.getClassifications()
  dropDown = '<select id="classification_id" name="classification_id" required>'
  dropDown += '<option value="0" disabled>Select a classification...</option>'
  classList.rows.forEach(category => {
    if (parseInt(category.classification_id) === parseInt(activeItem)) {
      dropDown += '<option value="' + category.classification_id + '" selected>' + category.classification_name + '</option>'
    } else {  
      console.log("didnt find it!")
      dropDown += '<option value="' + category.classification_id + '">' + category.classification_name + '</option>'
    }
  })
  dropDown += '</select>'
  return dropDown
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)


/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

module.exports = Util