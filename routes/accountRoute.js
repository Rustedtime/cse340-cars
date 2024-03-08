// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

// Route to build login page
router.get("/login", accountController.buildLogin);

// Route to build registration page
router.get("/register", accountController.buildRegister);
// Process the registration data
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    accountController.registerAccount
  )

module.exports = router;