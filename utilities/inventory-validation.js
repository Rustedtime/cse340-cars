const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
 *  Classification Data Validation Rules
 * ********************************* */
validate.classificationRules = () => {
    return [
      // classname is required and must not contain any spaces or special characters
      body("classification_name")
        .matches("^[a-zA-Z0-9]*$")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Classification name does not meet requirements."), // on error this message is sent.
    ]
  }

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkClassData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("inventory/add-classification", {
        errors,
        title: "Add new vehicle classification",
        nav,
        classification_name,
      })
      return
    }
    next()
  }

  /*  **********************************
 *  Classification Data Validation Rules
 * ********************************* */
validate.inventoryRules = () => {
    return [
      // make is required and must not contain any spaces or special characters
      body("inv_make")
        .matches("^[a-zA-Z0-9]*$")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Make name does not meet requirements."), // on error this message is sent.
      // model is required and must not contain any spaces or special characters
      body("inv_model")
        .matches("^[a-zA-Z0-9]*$")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Model name does not meet requirements."), // on error this message is sent.
      // year is required and must contain 4 digits
      body("inv_year")
        .matches("^[0-9]{4}")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Year must be 4 digits."), // on error this message is sent.
      // description is required
      body("inv_description")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Description does not meet requirements."), // on error this message is sent.
      // image is required
      body("inv_image")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Image path does not meet requirements."), // on error this message is sent.
      // thumbnail is required
      body("inv_thumbnail")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Thumbnail path does not meet requirements."), // on error this message is sent.
      // price is required and can only contain digits
      body("inv_price")
        .matches("^[0-9]*$")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Price must contain only digits."), // on error this message is sent.
      // milage is required and can only contain digits
      body("inv_miles")
        .matches("^[0-9]*$")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Miles must contain only digits."), // on error this message is sent.
      // color is required and must not contain any spaces or special characters
      body("inv_color")
        .matches("^[a-zA-Z0-9]*$")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Color does not meet requirements."), // on error this message is sent.
      // classification is required
      body("classification_id")
        .blacklist('0')
    ]
  }

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkInvData = async (req, res, next) => {
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      let dropdown = await utilities.buildClassificationDropdown(classification_id)
      res.render("inventory/add-inventory", {
        errors,
        title: "Add new vehicle classification",
        nav,
        dropdown,
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
      })
      return
    }
    next()
  }

  /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const { inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let dropdown = await utilities.buildClassificationDropdown(classification_id)
    res.render("inventory/edit-inventory", {
      errors,
      title: "Edit " + inv_make + inv_model,
      nav,
      dropdown,
      inv_make, 
      inv_model, 
      inv_year, 
      inv_description, 
      inv_image, 
      inv_thumbnail, 
      inv_price, 
      inv_miles, 
      inv_color, 
      classification_id,
      inv_id
    })
    return
  }
  next()
}
  
  module.exports = validate