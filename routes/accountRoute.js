// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')
const utilities = require('../utilities/index')

// Default route
router.get("/", utilities.checkLogin, accountController.buildAccount);
router.post("/", 
  utilities.checkLogin, 
  regValidate.passwordRules(),
  regValidate.checkPassword,
  accountController.updatePassword
);

// Route to build login page
router.get("/login", utilities.checkLogout, accountController.buildLogin);
// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  accountController.accountLogin
);

// Route to build registration page
router.get("/register", accountController.buildRegister);
// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  accountController.registerAccount
);

// Update account routes
router.get("/update", utilities.checkLogin, accountController.buildUpdateAccount);
router.post("/update", 
  utilities.checkLogin,
  regValidate.updateRules(),
  regValidate.checkUpdateData,
  accountController.updateAccount
);

module.exports = router;