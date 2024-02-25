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

module.exports = invCont