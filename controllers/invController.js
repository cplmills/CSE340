const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " Vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build inventory by vehicle ID view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inventoryId = req.params.inventoryId

  const data = await invModel.getInventoryByInventoryId(inventoryId)
  const item = await utilities.buildInventoryItem(data)
  let nav = await utilities.getNav()
  const vehicleName = data[0].inv_make + " - " + data[0].inv_model
  res.render("./inventory/inventoryId", {
    title: vehicleName,
    nav,
    item,
  })
}

/* ***************************
*  Build managment view
* ************************** */
invCont.buildManagementView = async function (req, res, next) {
  const inventoryId = req.params.inventoryId
  const item = await utilities.buildManagementView()
    let   nav  = await utilities.getNav()
    const vehicleName = "Inventory Managment"
    res.render("./inventory/management", {
      title: vehicleName,
      nav,
      item,
      errors: null,
    })
  }

/* ***************************
*  Build Add Classification view
* ************************** */
invCont.buildAddClassificationView = async function (req, res, next) {
  const inventoryId = req.params.inventoryId
  const item = await utilities.buildAddClassificationView()
    let   nav  = await utilities.getNav()
    const vehicleName = "Inventory Managment: New Classification"
    res.render("./inventory/add-classification", {
      title: vehicleName,
      nav,
      item,
      errors: null,
    })
  }

  /* ****************************************
*  Process New Classification
* *************************************** */
async function registerClassification(req, res) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  const invResult = await inventoryModel.setInventoryClassification(
    classification_name
  )
console.log(regResult)
  if (invResult) {
    req.flash(
      "notice",
      `Congratulations, you added a ${account_firstname} classification.`
    )
    res.status(201).render("invnetory/management/", {
      title: "Inventory Management",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, something whent wrong!.")
    res.status(501).render("inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null,
    })
  }
}
module.exports = invCont

