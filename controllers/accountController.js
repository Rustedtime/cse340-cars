const utilities = require("../utilities/index")
const accountModel = require("../models/account-model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
require("dotenv").config()

/* ****************************************
*  Deliver default view
* *************************************** */
async function buildAccount(req, res, next) {
  let nav = await utilities.getNav()
  let tools = await utilities.getAccountTools(req, res)
  let greeting = await utilities.getGreeting(req, res)
  res.render("account/default", {
    title: "Account",
    nav,
    tools,
    greeting,
    errors: null,
  })
}

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    let tools = await utilities.getAccountTools(req, res)
    res.render("account/login", {
      title: "Login",
      nav,
      tools,
    })
  }
  
/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    let tools = await utilities.getAccountTools(req, res)
    res.render("account/register", {
      title: "Register",
      nav,
      tools,
      errors: null,
    })
  }

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    let tools = await utilities.getAccountTools(req, res)
    const { account_firstname, account_lastname, account_email, account_password } = req.body
    const emailCheck = await accountModel.getAccountByEmail(account_email)
  if (emailCheck) {
    if (emailCheck.account_id != account_id) {
      req.flash("notice", "That email is already in use")
      return res.render("./account/register", {
        title: "Register",
        nav,
        tools,
        errors: null,
        account_firstname,
        account_lastname,
        account_email
      })
    }
  }
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      bcrypt.hashSync(account_password, 10)
    )
  
    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you\'re registered, ${account_firstname}. Please log in.`
      )
      res.status(201).render("account/login", {
        title: "Login",
        nav,
        tools,
        errors: null,
      })
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("account/register", {
        title: "Registration",
        nav,
        tools,
      })
    }
  }

  /* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  let tools = await utilities.getAccountTools(req, res)
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    title: "Login",
    nav,
    tools,
    errors: null,
    account_email,
   })
   return
  }
  try {
   if (await bcrypt.compare(account_password, accountData.account_password)) {
   delete accountData.account_password
   const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
   if(process.env.NODE_ENV === 'development') {
     res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
     } else {
       res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
     }
   return res.redirect("/account/")
   }
  } catch (error) {
   return new Error('Access Forbidden')
  }
 }

 /* ***************************
 *  Build edit account view
 * ************************** */
async function buildUpdateAccount(req, res, next) {
  let nav = await utilities.getNav()
  let tools = await utilities.getAccountTools(req, res)
  res.render("./account/update-account", {
    title: "Update Account Information",
    nav,
    tools,
    errors: null,
    account_firstname: res.locals.accountData.account_firstname,
    account_lastname: res.locals.accountData.account_lastname,
    account_email: res.locals.accountData.account_email,
    account_id: res.locals.accountData.account_id
  })
}

/* ***************************
 *  Update Account Data
 * ************************** */
async function updateAccount(req, res, next) {
  let nav = await utilities.getNav()
  let tools = await utilities.getAccountTools(req, res)
  console.log("Update Account is running")
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_id
  } = req.body
  const emailCheck = await accountModel.getAccountByEmail(account_email)
  if (emailCheck) {
    if (emailCheck.account_id != account_id) {
      req.flash("notice", "That email is already in use")
      return res.render("./account/update-account", {
        title: "Update Account Information",
        nav,
        tools,
        errors: null,
        account_firstname,
        account_lastname,
        account_email,
        account_id
      })
    }
  }
  const updateResult = await accountModel.updateAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_id
  )
  if (updateResult) {
    res.locals.accountData.account_firstname = account_firstname
    res.locals.accountData.account_lastname = account_lastname
    res.locals.accountData.account_email = account_email
    req.flash("notice", "Your account information has been updated")
    res.redirect("/account")
  } else {
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).res.render("./account/update-account", {
      title: "Update Account Information",
      nav,
      tools,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
      account_id
    })
  }
}

/* ***************************
 *  Update password
 * ************************** */
async function updatePassword(req, res, next) {
  let nav = await utilities.getNav()
  let tools = await utilities.getAccountTools(req, res)
  const {
    account_password,
    account_id
  } = req.body
  const updateResult = await accountModel.updatePassword(
    bcrypt.hashSync(account_password, 10),
    account_id
  )

  if (updateResult) {
    req.flash("notice", "Your password has been changed, please log back in.")
    res.redirect("/account/login")
  } else {
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).res.render("./account/update-account", {
      title: "Update Account Information",
      nav,
      tools,
      errors: null,
      account_firstname: res.locals.accountData.account_firstname,
      account_lastname: res.locals.accountData.account_lastname,
      account_email: res.locals.accountData.account_email,
      account_id
    })
  }
}
  
  module.exports = { buildAccount, buildLogin, buildRegister, registerAccount, accountLogin, buildUpdateAccount, updateAccount, updatePassword }