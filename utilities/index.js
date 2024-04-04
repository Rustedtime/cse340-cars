const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

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

/* ************************
 * Constructs classification dropdown
 ************************** */
Util.buildClassificationDropdown = async function (selected=0) {
  let data = await invModel.getClassifications()
  let list = '<option value="0">Choose a classification</option>'
  data.rows.forEach((row) => {
    list +=
      '<option value="' +
      row.classification_id +
      '"' 
    if (row.classification_id == selected) {
      list += ' selected="selected"'
    }
    list +=
      '>' +
      row.classification_name +
      '</option>'
  })
  list += "</div>"
  return list
}

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }

 /* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

 /* ****************************************
 *  Check Not Client
 * ************************************ */
 Util.checkNotClient = (req, res, next) => {
  if (res.locals.loggedin) {
    if (res.locals.accountData.account_type != 'Client') {
      next()
    } else {
      req.flash("notice", "You must be logged in as an Employee or Admin to view that page.")
      return res.redirect("/account/login")
    } 
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
  
 }

 /* ************************
 * Constructs the My Account header
 ************************** */
Util.getAccountTools = async function (req, res) {
  let tools
  if (res.locals.loggedin) {
    tools = '<a title="Click to log out" href="/account/login" id="logout">Log Out</a><br><a title="Click view account details" href="/account">Welcome, ' + res.locals.accountData.account_firstname + '</a>'
  } else {
    tools = '<a title="Click to log in" href="/account/login">My Account</a>'
  }

  return tools
}

/* ************************
 * Constructs account greeting
 ************************** */
Util.getGreeting = async function (req, res) {
  let greeting
  if (res.locals.loggedin) {
    if (res.locals.accountData.account_type == 'Client') {
      greeting = '<h2>Welcome, ' + res.locals.accountData.account_firstname + '</h2><br><a title="Click to update account information" href="/account/update">Update Account Information</a>'
    } else {
      greeting = 
        '<h2>Welcome, ' + 
        res.locals.accountData.account_firstname + 
        '</h2><br><a title="Click to update account information" href="/account/update">Update Account Information</a><br>' +
        '<br><h3>Inventory Management</h3><br><a title="Click to manage inventory" href="/inv/management">Manage Inventory</a>'
    } 
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }

  return greeting
}

/* ****************************************
 *  Check Log out
 * ************************************ */
Util.checkLogout = (req, res, next) => {
  if (res.locals.loggedin) {
    res.locals.loggedin = 0
    res.clearCookie("jwt")
    req.flash("notice", "You have logged out")
    return res.redirect("/")
  } else {
    next()
  }
 }

 /* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildReviewsGrid = async function(data){
  let grid = '<h1>Reviews</h2>'
  if(data.length > 0){
    data.forEach(review => { 
      grid += '<h3 class="review-user">' + review.account_firstname + ' ' + review.account_lastname + '</h3>'
      grid += '<div class="flex-container" id="review-stars">'
      let star = 0
      while (star < review.review_score) {
        grid += '<img src="../../images/site/yellow-star.png"></img>'
        star += 1
      }
      while (star < 5) {
        grid += '<img src="../../images/site/gray-star.png"></img>'
        star += 1
      }
      grid += '</div><br>'
      grid += '<p class="timestamp">' + review.review_time + '</p>'
      grid += '<p class="review-content">' + review.review_content + '</p><br><br>'
    })
    grid += '<br><br>'
  }
  return grid
}

/* ****************************************
 *  Check Login
 * ************************************ */
Util.buildReviewForm = async function(req, res, inv_id) {
  let grid = ''
  if (res.locals.loggedin) {
    grid += '<h3>Leave a review</h3>'
    grid += '<form class="review" action="/inv/detail/' + inv_id + '" method="post">'
    grid += '<label for="1-star" class="review">' +
      '<img src="../../images/site/yellow-star.png"></img>' + 
      '<img src="../../images/site/gray-star.png"></img>' +
      '<img src="../../images/site/gray-star.png"></img>' +
      '<img src="../../images/site/gray-star.png"></img>' +
      '<img src="../../images/site/gray-star.png"></img>' +
      '</label>'
    grid += '<input type="radio" id="1-star" name="review_score" value="1"><br>'
    grid += '<label for="2-star" class="review">' +
      '<img src="../../images/site/yellow-star.png"></img>' + 
      '<img src="../../images/site/yellow-star.png"></img>' +
      '<img src="../../images/site/gray-star.png"></img>' +
      '<img src="../../images/site/gray-star.png"></img>' +
      '<img src="../../images/site/gray-star.png"></img>' +
      '</label>'
    grid += '<input type="radio" id="2-star" name="review_score" value="2"><br>'
    grid += '<label for="3-star" class="review">' +
      '<img src="../../images/site/yellow-star.png"></img>' + 
      '<img src="../../images/site/yellow-star.png"></img>' +
      '<img src="../../images/site/yellow-star.png"></img>' +
      '<img src="../../images/site/gray-star.png"></img>' +
      '<img src="../../images/site/gray-star.png"></img>' +
      '</label>'
    grid += '<input type="radio" id="3-star" name="review_score" value="3"><br>'
    grid += '<label for="4-star" class="review">' +
      '<img src="../../images/site/yellow-star.png"></img>' + 
      '<img src="../../images/site/yellow-star.png"></img>' +
      '<img src="../../images/site/yellow-star.png"></img>' +
      '<img src="../../images/site/yellow-star.png"></img>' +
      '<img src="../../images/site/gray-star.png"></img>' +
      '</label>'
    grid += '<input type="radio" id="4-star" name="review_score" value="4"><br>'
    grid += '<label for="5-star" class="review">' +
      '<img src="../../images/site/yellow-star.png"></img>' + 
      '<img src="../../images/site/yellow-star.png"></img>' +
      '<img src="../../images/site/yellow-star.png"></img>' +
      '<img src="../../images/site/yellow-star.png"></img>' +
      '<img src="../../images/site/yellow-star.png"></img>' +
      '</label>'
    grid += '<input type="radio" id="5-star" name="review_score" value="5" checked><br><br>'
    grid += '<label for="review_content" class="review"><b>Review</b></label><br>'
    grid += '<textarea id="review_content" name="review_content" class="review" required></textarea><br>'
    grid += '<input type="hidden" name="inv_id" value="' + inv_id + '">'
    grid += '<input type="hidden" name="account_id" value="' + res.locals.accountData.account_id + '">'
    grid += '<input type="submit" value="Post Review" class="login" id="postReview">'
    grid += '</form>'
  } else {
    grid += '<p>Please <a title="Click to log in" href="/account/login">login</a> to leave a review'
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