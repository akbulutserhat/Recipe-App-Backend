const User = require('../models').User;
const AccountRole = require('../models').AccountRole;
const bcrypt = require('bcrypt');
const {check, validationResult} = require('express-validator');
const sendEmailVerification = require('./emailVerificationController').sendEmailVerification;
exports.validateSignupInput = [
    check('email', 'Your email address is not valid.').isEmail().normalizeEmail(),
    check('firstname').not().isEmpty().withMessage('Your first name can not be empty.'),
    check('lastname').not().isEmpty().withMessage('Your last name can not be empty.'),
    check('password').isLength({min: 8}).withMessage('Your password should have more than 8 characters.'),
    check('email','This email address is already in use').custom( async value => {
        let emailCheck = await User.findOne({ where: {
            email: value
            },
        });
        if (emailCheck) {
          return Promise.reject();
        }
    })
]

let getUserRoleId = async () => {
    let role = await AccountRole.findOne({
        where: {
            role: 'USER'
        },
    });
    if(role) {
        return role.id;
    }
}

exports.signup = async function (req, res) {
    console.log(req.body);

    const errors = validationResult(req); // validate with signupinput 
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    } 
    else {
        const fname = req.body.firstname;
        const lname = req.body.lastname;
        const email = req.body.email;
        const password = bcrypt.hashSync(req.body.password, 8); // to hash the user password.
        const roleId = await getUserRoleId().catch(err => {
            res.status(500).send(err);
        })  // get role id from the table.
        if(roleId) {
            await User.create({ firstName: fname, lastName: lname, email, password,AccountRoleId: roleId }).then(user => {
                console.log("user created with id: ", user.id);
                    sendEmailVerification(user.id,user.email,req.hostname);
                    res.status(201).send({
                        message: 'New user account created, please verify your email.',
                    });
              }).catch(err => {
                res.status(500).json(err);
            });
        }
    }
};