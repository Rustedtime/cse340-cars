const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<div class=\'flex-container\'>"
  list += '<div><a href="/" title="Home page">Home</a></div>'
  data.rows.forEach((row) => {
    list += "<div>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</div>"
  })
  list += "</div>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
    let grid
    if(data.length > 0){
      grid = '<div class="flex-container" id="inv-display">'
      data.forEach(vehicle => { 
        grid += '<div class="inv-item">'
        grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
        + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
        + 'details"><img src="' + vehicle.inv_thumbnail 
        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
        +' on CSE Motors" /></a>'
        grid += '<div class="namePrice">'
        grid += '<hr />'
        grid += '<h2>'
        grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
        grid += '</h2>'
        grid += '<span>$' 
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
        grid += '</div>'
        grid += '</div>'
      })
      grid += '</div>'
    } else { 
      grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
  }

  /* **************************************
* Build the details view HTML
* ************************************ */
Util.buildDetailsGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<div class="flex-container" id="inv-detail">'
    let vehicle = data[0]
    grid += '<div>'
    grid +=  '<img src="' + vehicle.inv_image 
    +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
    +' on CSE Motors" /></a>'
    grid += '<div>'
    grid += '<hr />'
    grid += '<h2><span>$' 
    + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span></h2>'
    grid += '<table><tr><td class="details">Make:</td><td class="details">' + vehicle.inv_make + '</td><tr>'
    grid += '<tr><td class="details">Model:</td><td class="details">' + vehicle.inv_model + '</td></tr>'
    grid += '<tr><td class="details">Year:</td><td class="details">' + vehicle.inv_year + '</td></tr>'
    grid += '<tr><td class="details">Color:</td><td class="details">' + vehicle.inv_color + '</td></tr>'
    grid += '<tr><td class="details">Style:</td><td class="details">' + vehicle.classification_name + '</td></tr>'
    grid += '<tr><td class="details">Milage:</td><td class="details">' + vehicle.inv_miles + '</td></tr></table>'
    grid += '<h3>Description</h3>'
    grid += '<p>' + vehicle.inv_description + '</p>'
    grid += '</div>'
    grid += '</div>'
    grid += '</div>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}


  /* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util