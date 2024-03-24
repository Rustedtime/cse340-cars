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
  let tools = await utilities.getAccountTools(req, res)
  let className
  if (data.length > 0){
    className = data[0].classification_name
  } else {
    className = "Oops"
  }
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    tools,
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
  let tools = await utilities.getAccountTools(req, res)
  res.render("./inventory/detail", {
    title: make + " " + model,
    nav,
    tools,
    grid,
  })
}

/* ****************************************
*  Deliver management view
* *************************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  let tools = await utilities.getAccountTools(req, res)
  let dropdown = await utilities.buildClassificationDropdown()
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    tools,
    dropdown,
    errors: null,
  })
}

/* ****************************************
*  Deliver add classification view
* *************************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  let tools = await utilities.getAccountTools(req, res)
  res.render("inventory/add-classification", {
    title: "Add new vehicle classification",
    nav,
    tools,
    errors: null,
  })
}

/* ****************************************
*  Process new classification
* *************************************** */
invCont.addClassification = async function (req, res) {
  let nav = await utilities.getNav()
  let tools = await utilities.getAccountTools(req, res)
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
      tools,
      errors: null,
    })
  } else {
    req.flash("notice", "The classification could not be added")
    res.status(501).render("inventory/add-classification", {
      title: "Add new vehicle classification",
      nav,
      tools,
    })
  }
}

/* ****************************************
*  Deliver add inventory view
* *************************************** */
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let tools = await utilities.getAccountTools(req, res)
  let dropdown = await utilities.buildClassificationDropdown(0)
  res.render("inventory/add-inventory", {
    title: "Add new vehicle",
    nav,
    tools,
    dropdown,
    errors: null,
  })
}

/* ****************************************
*  Process new inventory
* *************************************** */
invCont.addInventory = async function (req, res) {
  let nav = await utilities.getNav()
  let tools = await utilities.getAccountTools(req, res)
  
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
  let dropdown = await utilities.buildClassificationDropdown(classification_id)
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
      tools,
      dropdown,
      errors: null,
    })
  } else {
    req.flash("notice", "The vehicle could not be added")
    res.status(501).render("inventory/add-inventory", {
      title: "Add new vehicle to inventory",
      nav,
      tools,
      dropdown,
    })
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData.length > 0) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editByInvId = async function (req, res, next) {
  const inv_id = parseInt(req.params.invId)
  let nav = await utilities.getNav()
  let tools = await utilities.getAccountTools(req, res)
  const invData = await invModel.getInventoryById(inv_id)
  let itemData
  if (invData.length > 0) {
    itemData = invData[0]
  } else {
    req.flash("notice", "Vehicle not found.")
    return res.redirect("/inv/management")
  }
  const dropdown = await utilities.buildClassificationDropdown(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    tools,
    dropdown: dropdown,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let tools = await utilities.getAccountTools(req, res)
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/management")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    tools,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
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
  }
}

module.exports = invCont