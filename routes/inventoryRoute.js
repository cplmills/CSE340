// Needed Resources 
const utilities = require('../utilities')
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const invValidate = require('../utilities/inventory-validation')

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory by inventory id view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId));

// Route to build managment view
router.get("/management", utilities.handleErrors(invController.buildManagementView));

// Route to build new classification view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassificationView));

// Route to register a new classification
// Process the classification form data
router.post(
    "/add-classification",
    invValidate.classificationRules(),
    invValidate.checkData,
    utilities.handleErrors(invController.registerClassification)
  )


module.exports = router;