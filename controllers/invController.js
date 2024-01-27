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
module.exports = invCont

