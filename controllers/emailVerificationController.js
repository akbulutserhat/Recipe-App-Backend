const User = require('../models').User;
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
const tokenConfig = require('../token-config');
const nodemailer = require('nodemailer');
const dotenv = require("dotenv");
dotenv.config();

exports.verifyEmail = (req,res) => {
    jwt.verify(req.params.token, tokenConfig.secret, function(err, decoded) {
        if (err){
            res.status(500).send({ auth: false, verification: false, message: 'Failed to email verification.' });
        }
        else {
            User.update({
                isVerified: true,
              }, {
                where: {
                  id: decoded.id
                }
              }).then(user => {
                res.status(200).send({message: 'account verified successfully' });
                  //res.redirect("www.google.com");
              }).catch(err => {
                res.status(500).send(err);  
            });
         }
    });
} 

function createTransporter() {
    let transporter = nodemailer.createTransport({
        service: 'outlook',
        secureConnection: false, // TLS requires secureConnection to be false
        port: 587, // port for secure SMTP - TLS
        tls:{
            rejectUnauthorized:false
        },
        auth: {
            user: process.env.EMAIL_VERIFICATION_MAIL, // generated ethereal user
            pass: process.env.EMAIL_VERIFICATION_PASSWORD // generated ethereal password
        }
    });
    return transporter;
}

exports.sendEmailVerification = (userId,userMail,hostname) => {
        new Promise((resolve) => {
            const transporter = createTransporter();
            resolve(transporter);
        }).then(transporter => {
            jwt.sign({
                id: userId   
            },
            tokenConfig.secret,
            {
                expiresIn: '1d'
            },(err,emailToken) => {
               // const url = `https://${hostname}/api/user/confirmation/${emailToken}`;
                const url = `http://localhost:5000/api/user/confirmation/${emailToken}`;
                transporter.sendMail({
                    to:  userMail,  // alptekin_1997@hotmail.com -> kendi mailim
                    subject : 'Email Confirmation',
                    html: `<h3>Email adresinizi doğrulamak için linke tıklayınız.</h3> 
                        <a href="${url}">${url}</a>`
                });
                if(err)
                    console.error(err);
            })
        }).catch(err => {
            console.error(err);
        })
}
