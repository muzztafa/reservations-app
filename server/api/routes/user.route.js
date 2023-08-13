const express = require("express");

const controller = require("../controller/user.controller");

const router = express.Router();

/**
 * @api {post} user/register
 * @apiDescription Register with Email
 */
router.route("/register").post(controller.userRegister);

/**
 * @api {post} user/login
 * @apiDescription Login with Email
 */
router.route("/login").post(controller.userLogin);

// /**
//  * @api {post} user/fetch details
//  * @apiDescription Fetch user details
//  */
// router.route("/update-details").put(controller.updateUser);

// /**
//  * @api {post} user/fetch details
//  * @apiDescription Fetch user details
//  */
// router.route("/fetch-details/:userId").get(controller.fetchDetails);

module.exports = router;
