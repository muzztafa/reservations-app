const bcrypt = require("bcryptjs");
// const Users = require("../models/user.model");
const crypto = require("crypto");
// const mailer = require("../service/mailer.service");
// const mongoose = require("mongoose");
const db = require("../../../firebase")
const jwt = require("jsonwebtoken");

exports.getReservations = async (req, res, next) => {
    try {
        dataList = []
        const collectionRef = db.collection("reservations").orderBy("start_time");
        const querySnapshot = await collectionRef.get();

        querySnapshot.forEach((doc) => {
            dataList.push({ id: doc.id, ...doc.data() });
        });

        return res.status(200).json({
            data: dataList,
            message:
                "Success",
        });


    } catch (error) {
        console.error(error);
        return res.status(500).json({

            message: "Something went wrong",
        });
    }
};


exports.addReservation = async (req, res, next) => {
    try {
        let reservationDetails = req.body;
        let { start_time, count } = reservationDetails;
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                message: "Unauthorized.",
            });
        }
       
        const loggedUser = jwt.verify(token, process.env.JWT_SECRET);
        
        if (!start_time || !count) {
            return res.status(400).json({
                message: "Incorrect fields sent",
            });
        }

        const newReservation = {
            ...reservationDetails,
            status: "Entered",
            entered_by: loggedUser.email,
        }
        const reservationsCollection = db.collection('reservations');
        reservationsCollection.add(newReservation).then((docRef) => {
            console.log('Document added with ID:', docRef.id);
        })
        return res.status(200).json({
            data: newReservation,
            message:
                "Success",
        });


    } catch (error) {
        console.error(error);
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({

                message: "Unauthorized",
            });
        }
        
        return res.status(500).json({

            message: "Something went wrong",
        });
    }
};


exports.updateReservation = async (req, res, next) => {
    try {
        let reservationDetails = req.body;
        let { id } = reservationDetails;
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                message: "Unauthorized.",
            });
        }
       
        const loggedUser = jwt.verify(token, process.env.JWT_SECRET);
        
        if ( !id) {
            return res.status(400).json({
                message: "Incorrect fields sent, doc ID not present.",
            });
        }

        // const newReservation = {
        //     ...reservationDetails,
        //     status: "Entered",
        //     entered_by: loggedUser.email
        // }
        const reservationsCollection = db.collection('reservations');
        const newReservation = reservationsCollection.doc(reservationDetails["id"]).set(reservationDetails).then((docRef) => {
            console.log('Document updated with ID:', docRef.id);
        })

        return res.status(200).json({
            data: newReservation,
            message:
                "Successfully updated",
        });


    } catch (error) {
        console.error(error);
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({

                message: "Unauthorized",
            });
        }
        
        return res.status(500).json({

            message: "Something went wrong",
        });
    }
};
