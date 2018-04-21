const {USER_ROLE, DBNAME, SECRET, USER_COLLECTION} = require('../shared/app-constants');
const DBService = require('../shared/db.service');
const jwt = require('jsonwebtoken');
const ObjectID = require('mongodb').ObjectID;
const nodemailer = require('nodemailer');

const userService = require('../service/user.service');

exports.createUser = function (req, res) {

    DBService.findOne({$or: [{username: req.body.username}, {email: req.body.email}]}, DBNAME, 'users').then(function (userObject){
        if (userObject) {
            if (userObject.email === req.body.email) {
                return res.status(500).send({
                    success: false,
                    message: 'Email already present. Please enter different Email address'
                });
            } else if (userObject.username === req.body.username) {
                return res.status(500).send({
                    success: false,
                    message: 'Username already present. Please enter different username'
                });
            }
        } else {

            let userInfo = {
                username: req.body.username,
                password: req.body.password,
                firstName: req.body.firstname,
                lastName: req.body.lastname,
                email: req.body.email,
                phone: req.body.phone,
                role: USER_ROLE,
                credits: 10
            };

            DBService.insertOne(userInfo, DBNAME, USER_COLLECTION).then(function () {
                console.log('User added Successfully');
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'acharya.rupesh0@gmail.com',
                        pass: 'dishaclasses'
                    }
                });

                var mailOptions = {
                    from: 'acharya.rupesh0@gmail.com',
                    to: req.body.email,
                    subject: 'Greetings from Announcments',
                    text: 'Dear ' +req.body.username + ',\nThank you for registering with us you can now make charts using your credits.\n\nRegards,\nAnnouncemnts Team'
                };

                transporter.sendMail(mailOptions, function(error, info){
                    console.log(mailOptions);
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
                res.status(200).json({
                    success: true,
                    message: `User ${userInfo.firstName} registered.`
                });
            }).catch(function (error) {
                console.log('Unable to add user', error);
                res.status(400).json({
                    success:false,
                    message: error.message
                })
            })
        }
    });
};

exports.authenticateUser = function (req, res) {
    DBService.findOne({username: req.body.username}, DBNAME, 'users').then(function (userObject) {
        if (userObject) {
            if (userObject.password === req.body.password) {
                let token = jwt.sign({"user": userObject}, SECRET, {
                    expiresIn: "1d"
                });
                res.status(200).send({
                    success: true,
                    message: "User Authenticated",
                    payload: {
                        token,
                        userObject
                    }
                })
            } else {
                return res.status(500).send({
                    success: false,
                    message: 'Incorrect password'
                });
            }
        } else {
            return res.status(500).send({
                success: false,
                message: 'Incorrect username'
            });
        }
    });
};

exports.deleteUser = function (req, res) {
    console.log('ID', req.params.id);
    DBService.deleteOne({_id: ObjectID(req.params.id)}, DBNAME, 'users').then(function (result) {
        if (result && result.result && result.deletedCount === 1) {
            res.status(200).send({
                success: true,
                message: "User Deleted",
            })
        } else {
            return res.status(500).send({
                status: 500,
                success: false,
                message: 'Unable to delete user'
            });
        }
    });
};

exports.resetPassword = async function (req, res) {

    if (req.body.email) {
        try {
            let result = await userService.forgotPassword(req.body.email);

            if (result) {
                res.status(200).send({
                    success: true,
                    message: "A temporary password has been sent to your registered email Id"
                });
            }
        } catch (error) {
            res.status(400).send({
                success: false,
                message: error.message
            });
        }
    } else {
        return res.status(400).send({
            success: false,
            message: 'Incorrect parameters passed'
        });
    }




   /* DBService.findOne({email: req.body.email}, DBNAME, 'users').then(function (userObject) {
        if(userObject.email === req.body.email) {

            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'youremail@gmail.com',
                    pass: 'yourpassword'
                }
            });


            var newPassword = generator.generate({
                length: 10,
                numbers: true
            });

            var mailOptions = {
                from: 'youremail@gmail.com',
                to: req.body.emailFormControl,
                subject: 'Reset Password Mail',
                text: 'Your new password is '+newPassword
            };

            transporter.sendMail(mailOptions, function(error, info){
                console.log(mailOptions);
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });

            /!*let userInfo = {
                password: userObject.password

            };


            DBService.updateOne({$set: {password: newPassword}}, DBNAME);*!/

          res.status(200).send({
              success: true,
              message: 'A temporary password has been sent to your registered email Id'
          })
        } else {
            console.log("Hiii");
            return res.status(500).send({
                success: false,
                message: 'This email Id is not registered with us. Please enter the correct one'
            });
        }
    });*/
};

exports.updateUser = function (req, res) {

    DBService.findOne({$or: [{username: req.body.username}, {email: req.body.email}]}, DBNAME, 'users').then(function (userObject){
            let userInfo = {
                username: req.body.username,
                password: req.body.password,
                firstName: req.body.firstname,
                lastName: req.body.lastname,
                email: req.body.email,
                phone: req.body.phone,
                role: USER_ROLE,
                credits: 10
            };

            DBService.updateOne(userInfo, DBNAME).then(function () {
                console.log('User updated Successfully');
            })
    });
};