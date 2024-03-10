const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  let className
  if (data.length > 0){
    className = data[0].classification_name
  } else {
    className = "Oops"
  }
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build details by inventory Id
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.invId
  const data = await invModel.getInventoryById(inv_id)
  const grid = await utilities.buildDetailsGrid(data)
  let make
  let model
  if (data.length > 0){
    make = data[0].inv_make
    model = data[0].inv_model
  } else {
    make = "Oops."
    model = "Oops x 2"
  } 
  let nav = await utilities.getNav()
  res.render("./inventory/detail", {
    title: make + " " + model,
    nav,
    grid,
  })
}

/* ****************************************
*  Deliver management view
* *************************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Deliver add classification view
* *************************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add new vehicle classification",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Process new classification
* *************************************** */
invCont.addClassification = async function (req, res) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  const classResult = await invModel.addClassification(
    classification_name
  )

  if (classResult) {
    req.flash(
      "notice",
      `Added new vehicle classification: ${classification_name}`
    )
    res.status(201).render("inventory/add-classification", {
      title: "Add new vehicle classification",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "The classification could not be added")
    res.status(501).render("inventory/add-classification", {
      title: "Add new vehicle classification",
      nav,
    })
  }
}

/* ****************************************
*  Deliver add inventory view
* *************************************** */
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let dropdown = await utilities.buildClassificationDropdown()
  res.render("inventory/add-inventory", {
    title: "Add new vehicle",
    nav,
    dropdown,
    errors: null,
  })
}

/* ****************************************
*  Process new inventory
* *************************************** */
invCont.addInventory = async function (req, res) {
  let nav = await utilities.getNav()
  let dropdown = await utilities.buildClassificationDropdown()
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body

  const vehicleResult = await invModel.addInventory(
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
  )

  if (vehicleResult) {
    req.flash(
      "notice",
      `Added ${inv_year} ${inv_make} ${inv_model}`
    )
    res.status(201).render("inventory/add-inventory", {
      title: "Add new vehicle to inventory",
      nav,
      dropdown,
      errors: null,
    })
  } else {
    req.flash("notice", "The vehicle could not be added")
    res.status(501).render("inventory/add-inventory", {
      title: "Add new vehicle to inventory",
      nav,
      dropdown,
    })
  }
}

module.exports = invCont