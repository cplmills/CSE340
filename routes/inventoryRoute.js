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
router.get("/", (req, res, next) => utilities.checkLogin(req, res, next, ['admin', 'employee']), utilities.handleErrors(invController.buildManagementView));

// Route to build new classification view
router.get("/add-classification", (req, res, next) => utilities.checkLogin(req, res, next, ['admin', 'employee']), utilities.handleErrors(invController.buildAddClassificationView));

// Route to build new route to return an inventory as JSON
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Route to register a new classification
// Process the classification form data
router.post(
    "/add-classification",
    (req, res, next) => utilities.checkLogin(req, res, next, ['admin', 'employee']),
    invValidate.classificationRules(),
    invValidate.checkData,
    utilities.handleErrors(invController.registerClassification)
  )

// Route to build new inventory item view
router.get("/add-inventory", (req, res, next) => utilities.checkLogin(req, res, next, ['admin', 'employee']), utilities.handleErrors(invController.buildAddInventoryView));

// Route to register a new inventory item
// Process the inventory item form data
router.post(
    "/add-inventory",
    invValidate.addInventoryRules(),
    invValidate.checkInventoryData,
    utilities.handleErrors(invController.registerInventoryItem)
  )

// Route to modify inventory
router.get("/edit/:inventory_id", (req, res, next) => utilities.checkLogin(req, res, next, ['admin', 'employee']), utilities.handleErrors(invController.buildEditInventoryView))

// Route to update inventory
router.post("/update/", 
(req, res, next) => utilities.checkLogin(req, res, next, ['admin', 'employee']),
invValidate.newInventoryRules(),
invValidate.checkUpdateData,
utilities.handleErrors(invController.updateInventory))

// Route to update inventory
router.get("/delete/:inventory_id", 
(req, res, next) => utilities.checkLogin(req, res, next, ['admin', 'employee']),
utilities.handleErrors(invController.buildDeleteInventoryView))

// Route to update inventory
router.post("/delete/",
(req, res, next) => utilities.checkLogin(req, res, next, ['admin', 'employee']),
utilities.handleErrors(invController.deleteInventory))

module.exports = router;