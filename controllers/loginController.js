const User = require('../models').User;
const AccountStatus = require("../models").AccountStatus;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {check, validationResult} = require('express-validator/check');
const tokenConfig = require('../token-config');

exports.validateLoginInput = [  // öncelik sırası önemlidir ona göre ayarlı!
    check('email', 'Email format is not valid').isEmail().normalizeEmail(),
    check('password').isLength({min: 8}).withMessage('Your password must have at least 8 characters'),
    check('email','No account found with that email').custom( async value => {
        let emailCheck = await User.findOne({ where: {
            email: value
            }
        });
        if (!emailCheck) {
            return Promise.reject();
          }
    }),
    // This validation is planned for email verification constraint.
    check('email','Please verify your email to login.').custom( async value => {
        let emailCheck = await User.findOne({ where: {
            email: value
            },
        });
        if (emailCheck && !emailCheck.isVerified) { // email account is not verified.
          return Promise.reject();
        }
    }), 
    check('password','Your password is wrong. Try again or reset by clicking forget my password').custom( async (value,{req}) => {
        let emailCheck = await User.findOne({ where: {
            email: req.body.email
            },
        });
        if(emailCheck) {
            var passwordIsValid = bcrypt.compareSync(value, emailCheck.password);
            if(!passwordIsValid)  // wrong password input
             return Promise.reject();
        }
    })
]
let getOnlineStatus = async () => {
    let role = await AccountStatus.findOne({
        where: {
            status: 'ONLINE'
        },
    });
    if(role) {
        return role.id;
    }
}
exports.login = async function(req,res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array()); // bad request
    } 
    else {
        const status = await getOnlineStatus().catch(err => {
            res.status(500).send(err);  
        });
        if(status) {
            User.findOne({
                where: {email: req.body.email}
            }).then(user => { //user exists
                var token = jwt.sign({ id: user.id }, tokenConfig.secret, {
                    expiresIn: 43200 // expires in 12 hours
                    });
                return {user,token};
            }).then( data => {
                data.user.update({AccountStatusId: status});
                return data.token;
            }).then(token => {
                res.status(200).send({ auth: true, token: token });             
            }).catch(err => {
                res.status(500).send(err);  
            });
        }
    }
};
