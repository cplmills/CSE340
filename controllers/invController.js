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
  const content = await utilities.buildInventoryItem(data)
  let nav = await utilities.getNav()
  const vehicleName = data[0].inv_make + " - " + data[0].inv_model
  res.render("./inventory/inventoryId", {
    title: vehicleName,
    nav,
    content,
  })
}

/* ***************************
*  Build managment view
* ************************** */
invCont.buildManagementView = async function (req, res, next) {
  const inventoryId = req.params.inventoryId
  //const content = await utilities.buildManagementView()
  let   nav  = await utilities.getNav()
  const vehicleName = "Inventory Managment"
  // call function to create a select list in inventory management view
  const classificationSelect = await utilities.buildClassificationList()

  res.render("./inventory/management", {
    title: vehicleName,
    nav,
    classificationSelect,
    errors: null,
  })
}

/* ***************************
*  Build Add Classification view
* ************************** */
invCont.buildAddClassificationView = async function (req, res, next) {
  const inventoryId = req.params.inventoryId
    let nav = await utilities.getNav()
    const vehicleName = "Inventory Managment: New Classification"
    res.render("./inventory/add-classification", {
      title: vehicleName,
      nav,
      errors: null,
    })
  }

/* ****************************************
*  Process New Classification
* *************************************** */
invCont.registerClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  const invResult = await invModel.setInventoryClassification(
    classification_name
  )
  if (invResult) {
    req.flash(
      "notice",
      `Congratulations, you added: ${classification_name} classification.`
    )
    let nav = await utilities.getNav()
    const content = await utilities.buildManagementView()
    res.status(201).render("inventory/management", {
      title: "Inventory Management",
      nav,
      content,
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

/* ***************************
*  Build Add Inventory view
* ************************** */
invCont.buildAddInventoryView = async function (req, res, next) {
  const inventoryId = req.params.inventoryId
    let nav = await utilities.getNav()
    let cats = await utilities.buildClassificationList()

    const titleName = "Inventory Managment: New Item"
    res.render("./inventory/add-inventory", {
      title: titleName,
      nav,
      cats,
      errors: null
    })
  }

/* ****************************************
*  Process New Inventory Item
* *************************************** */
invCont.registerInventoryItem = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id } = req.body

  const invResult = await invModel.setInventoryItem(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  )
  if (invResult) {
    req.flash(
      "notice",
      `Congratulations, you added: ${inv_make + ' ' + inv_model}.`
    )
    let nav = await utilities.getNav()
    const content = await utilities.buildManagementView()
    res.status(201).render("inventory/management", {
      title: "Inventory Management",
      nav,
      content,
      errors: null
    })
  } else {
    req.flash("notice", "Sorry, something whent wrong!.")
    res.status(501).render("inventory/management", {
      title: "Inventory Management",
      nav,
      content,
      errors: null,
    })
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Edit Inventory by inv_id view
 * ************************** */

invCont.buildEditInventoryView = async function (res, req, next) {
  const inventoryId = parseInt(req.req.params.inventory_id)
  let nav = await utilities.getNav()
  let itemData = await invModel.getInventoryByInventoryId(inventoryId)
  itemData = itemData[0]
  let cats = await utilities.buildClassificationList()
  let itemName = `${itemData.inv_make} ${itemData.inv_model}`

  const titleName = "Edit Item: " + itemName
  res.res.render("./inventory/edit-inventory", {
    title: titleName,
    nav,
    cats,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}


module.exports = invCont

