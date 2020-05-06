const express = require("express");
const router = express.Router();
const {
    check,
    validationResult
} = require('express-validator');

const {
    signup,
    signin
} = require("../controllers/user");
const {
    userSignupValidator
} = require("../validator");

router.post("/signup", userSignupValidator, signup);
router.post("/signin", signin);
// router.get("/signout", signout);

module.exports = router;