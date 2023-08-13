const express = require("express");

const controller = require("../controller/reservations.controller");

const router = express.Router();

/**
 * @api {post} reservations/add
 * @apiDescription Register with Email
 */
router.route("/add").post(controller.addReservation);

/**
 * @api {get} reservations
 * @apiDescription Login with Email
 */
router.route("/").get(controller.getReservations);

module.exports = router;
