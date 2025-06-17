const { body, validationResult } = require('express-validator');

const validateUser = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),

  body('email')
    .normalizeEmail()
    .isEmail().withMessage('Invalid email format'),

  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain a lowercase letter')
    .matches(/[0-9]/).withMessage('Password must contain a digit')
    .matches(/[@$!%*?&#]/).withMessage('Password must contain a special character'),

  // Additional field example
  body('mobile')
    .optional()
    .isMobilePhone().withMessage('Invalid mobile number'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ 
        success: false,
        errors: errors.array().map(err => ({
          field: err.param,
          message: err.msg
        }))
      });
    }
    next();
  }
];

module.exports = validateUser;
