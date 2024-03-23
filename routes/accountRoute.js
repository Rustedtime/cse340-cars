// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')
const utilities = require('../utilities/index')

// Default route
router.get("/", utilities.checkLogin, accountController.buildAccount);

// Route to build login page
router.get("/login", accountController.buildLogin);
// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  accountController.accountLogin
)

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