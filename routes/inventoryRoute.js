// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const regValidate = require('../utilities/inventory-validation')

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build inventory details page
router.get("/detail/:invId", invController.buildByInvId);

// Inventory management routes
router.get("/management", invController.buildManagement)
// Add Classification
router.get("/management/addclassification", invController.buildAddClassification)
// Process new classification
router.post(
    "/management/addclassification",
    regValidate.classificationRules(),
    regValidate.checkClassData,
    invController.addClassification
  )
// Add Inventory
router.get("/management/addvehicle", invController.buildAddInventory)
// Process new inventory
router.post(
    "/management/addvehicle",
    regValidate.inventoryRules(),
    regValidate.checkInvData,
    invController.addInventory
  )

module.exports = router;