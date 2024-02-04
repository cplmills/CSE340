const utilities = require('.')
const { body, validationResult } = require("express-validator") 
const validate = {}
const invModel = require('../models/inventory-model')

/*  **********************************
 *  Classification Data Validation Rules
 * ********************************* */
validate.classificationRules = () => {
    return [
      // classification is required and must be string with no symbold
      body("classification_name")
        .trim()
        .isAlphanumeric()
        .withMessage("Please provide a name with no spaces or symbols"), // on error this message is sent.
    ]
  }

  /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("inventory/add-classification", {
        errors,
        title: "Add Classification",
        nav,
        classification_name,
      })
      return
    }
    next()
  }
  
  /*  **********************************
 *  Add Inventory Data Validation Rules
 * ********************************* */
validate.addInventoryRules = () => {
  return [
    // classification is required and must be string with no symbold
    body("inv_make")
      .trim()
      .escape(),

    body("inv_model")
      .trim()
      .escape()
      .isLength({ min: 2 })
      .withMessage("Model must be at least 2 characters long"),

    body("inv_year")
      .trim()
      .escape()
      .isNumeric()
      .isLength(4)
      .withMessage("Please make sure the year is in the format ####"),

    body("inv_description")
      .trim()
      .escape()
      .isLength({ min: 20 })
      .withMessage("Description must be at least 20 characters long"),

    body("inv_miles")
      .trim()
      .escape(),

    body("inv_color")
      .trim()
      .escape()
      .isAlpha()
      .withMessage("Color must only contain alpha characters"),   
  ]
}

 /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
 validate.checkInventoryData = async (req, res, next) => {
  const { classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body
  const { content } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let cats = await utilities.populateClassificationDropDown(classification_id)

    res.render("inventory/add-inventory", {
      errors,
      title: "Add Inventory Item",
      nav,
      content,
      classification_id,
      inv_make, 
      inv_model, 
      inv_year, 
      inv_description, 
      inv_image, 
      inv_thumbnail, 
      inv_price, 
      inv_miles, 
      inv_color,
      cats
    })
    return
  }
  next()
}
  module.exports = validate

