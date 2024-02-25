// Needed Resources 
const express = require("express")
const router = new express.Router() 
const errorController = require("../controllers/errorController")

// Route that causes a 500 error
router.get("/", errorController.causeError);

module.exports = router;