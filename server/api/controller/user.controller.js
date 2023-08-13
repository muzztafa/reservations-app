const bcrypt = require("bcryptjs");
// const Users = require("../models/user.model");
const crypto = require("crypto");
// const mailer = require("../service/mailer.service");
// const mongoose = require("mongoose");
const db = require("../../../firebase")
const jwt = require("jsonwebtoken");

exports.userRegister = async (req, res, next) => {
    try {
        if (!req.body.email) {
            return res.status(500).json({
                message: "Incorrect Request. Please enter complete details",
            });
        }

        let userDetails = req.body;
        let { email } = userDetails;

        // Check account doesnt exist
        let emailExists = false;
        const usersCollection = db.collection('users');
        await usersCollection
            .where('email', '==', email)
            .get()
            .then((querySnapshot) => {
                console.log(querySnapshot.empty)
                if (!querySnapshot.empty) {
                    emailExists = true;
                }
            })

        if (emailExists) {
            return res.status(401).json({
                message:
                    "User email already exists.",
            });
        }


        // Hash Password
        const rounds = 12;
        const hash = await bcrypt.hash(userDetails.password, rounds);
        userDetails.password = hash;

        //name, email, password
        const newUser = {
            ...userDetails,
            isActivated: false, //email activation logic for later 
        };
        usersCollection.add(newUser).then((docRef) => {
            console.log('Document added with ID:', docRef.id);
        })

        // // Email Logic
        // crypto.randomBytes(10, async (err, buf) => {
        //     newUser.activationCode = Date.now() + buf.toString("hex");
        //     const link = `${process.env.BASE_URL}/activate?token=${newUser.activationCode}`;

        //     mailer({
        //         to: userDetails.email,
        //         text: `Please click ${link} to activate your account`,
        //         html:
        //             'Please click <a href="' +
        //             link +
        //             '"> here </a> to activate your account.',
        //     });

        //     await newUser.save(async (err, user) => {
        //         if (err) {
        //             return res.status(400).json({
        //                 message: "error " + err,
        //             });
        //         }

        return res.status(200).json({
            newUser,
            message:
                "User registration successful. Please login",
        });


    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Unable to create account",
        });
    }
};

exports.userLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Email not received. Please provide correct details.",
            });
        }

        let userExists = false;
        let user = {}
        const usersCollection = db.collection('users');
        await usersCollection
            .where('email', '==', email)
            .get()
            .then((querySnapshot) => {
                if (!querySnapshot.empty) {
                    userExists = true;
                    querySnapshot.forEach((doc) => {
                        user = doc.data();
                        user.id = doc.id;
                    });
                }
            })

        if (!userExists) {
            return res.status(400).json({
                message: "Email not found. Invalid login credentials",
            });
        }

        //check if password hash matches
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Incorrect password. Please try again",
            });
        }
        let token = getToken(user);

        res.cookie("token", token, { httpOnly: true });

        //for email logic later
        // if (!user.isActivated) {
        //     return res.status(400).json({
        //         message:
        //             "Your account has not been verified. Please check your email to verify your account",
        //     });
        // }

        return res.status(200).json({
            token,
            user,
            message: "You are now logged in.",
        });
    } catch (err) {
        console.error("ERROR: ", err);
        next(err);
    }
};

getToken = (user) => {
    const secret = process.env.JWT_SECRET;
    const payload = {
        id: user.id,
        email: user.email,
        name: user.name,
    };
    return jwt.sign(payload, secret);
};