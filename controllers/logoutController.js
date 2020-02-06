const User = require('../models').User;
const AccountStatus = require("../models").AccountStatus;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {check, validationResult} = require('express-validator/check');
const tokenConfig = require('../token-config');

let getOfflineStatus = async () => {
    let role = await AccountStatus.findOne({
        where: {
            status: 'OFFLINE'
        },
    });
    if(role) {
        return role.id;
    }
}

exports.logout = async (req,res) => {
    var token = req.headers['x-access-token'];
    if (!token)  res.status(401).send({ auth: false, message: 'No token provided.' });  // forbidden to access data.
    else {
        const status = await getOfflineStatus().catch((err)=> {
            res.status(500).send(err);
        });
        if(status)
            await jwt.verify(token, tokenConfig.secret, function(err, decoded) {
                if (err) 
                    res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
                else {
                    User.update({AccountStatusId: status},{
                        where: {
                            id: decoded.id
                        }
                    }).then(User => {
                        res.status(200).send({
                            message: 'Account logout successfully.'
                        });
                    });
                }
            });
    }
}
