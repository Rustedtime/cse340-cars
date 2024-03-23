// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const regValidate = require('../utilities/inventory-validation')
const utilities = require('../utilities/index')

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build inventory details page
router.get("/detail/:invId", invController.buildByInvId);

// Inventory management routes
router.get("/management", utilities.checkNotClient, invController.buildManagement)
// Add Classification
router.get("/management/addclassification", utilities.checkNotClient, invController.buildAddClassification)
// Process new classification
router.post(
    "/management/addclassification",
    regValidate.classificationRules(),
    regValidate.checkClassData,
    utilities.checkNotClient,
    invController.addClassification
  )
// Add Inventory
router.get("/management/addvehicle", utilities.checkNotClient, invController.buildAddInventory)
// Process new inventory
router.post(
    "/management/addvehicle",
    regValidate.inventoryRules(),
    regValidate.checkInvData,
    utilities.checkNotClient,
    invController.addInventory
  )

// Route to build inventory modification page
router.get("/edit/:invId", utilities.checkNotClient, invController.editByInvId);
// Route to process inventory update
router.post(
    "/update/",
    regValidate.inventoryRules(),
    regValidate.checkUpdateData, 
    utilities.checkNotClient, 
    invController.updateInventory
  )

// Get Inventory
router.get("/getInventory/:classification_id", invController.getInventoryJSON)

module.exports = router;