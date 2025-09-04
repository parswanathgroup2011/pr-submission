const Joi = require("joi");

// Signup Validation Middleware
const signupValidation = (req, res, next) => {
  const schema = Joi.object({
    clientName: Joi.string().min(3).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(4).max(100).required(),
    confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
      "any.only": '"confirmPassword" must match "password"',
    }),
    clientType: Joi.string().valid("B2B", "B2C").required(),
    companyName: Joi.string().min(2).required(),
    mobileNumber: Joi.string()
      .pattern(/^[6-9]\d{9}$/)
      .required()
      .messages({ "string.pattern.base": "Enter a valid mobile number" }),
    address: Joi.string().min(5).required(),
    state: Joi.string().min(2).required(),
    city: Joi.string().min(2).required(),
    pincode: Joi.string()
      .pattern(/^\d{6}$/)
      .required()
      .messages({ "string.pattern.base": "Enter a valid pincode" }),
    website: Joi.string().uri().allow("").optional(),

    gstNumber: Joi.string()
      .pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)
      .required()
      .messages({ "string.pattern.base": "Enter a valid GST number" }),

    panNumber: Joi.string()
      .pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)
      .required()
      .messages({ "string.pattern.base": "Enter a valid PAN number" }),

    ifscCode: Joi.string()
      .pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/)
      .required()
      .messages({ "string.pattern.base": "Enter a valid IFSC code" }),

    bankName: Joi.string().min(2).required(),
    branchName: Joi.string().min(2).required(),

    micrCode: Joi.string()
      .pattern(/^\d{9}$/)
      .required()
      .messages({ "string.pattern.base": "MICR Code must be 9 digits" }),

    branchCode: Joi.string().required(),
    authorisedName: Joi.string().min(3).required(),

    accountNumber: Joi.string()
      .pattern(/^\d{9,18}$/)
      .required()
      .messages({ "string.pattern.base": "Account number must be 9–18 digits" }),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });

  // Handle file fields
  const requiredFiles = ["profileImage", "businessLogo", "gstImage", "panImage"];
  const missingFiles = requiredFiles.filter((field) => {
    const file = req.files?.[field];
    return !file || (Array.isArray(file) ? !file[0] : false);
    
  });

  if (error || missingFiles.length > 0) {
    return res.status(400).json({
      message: "Validation Failed",
      errors: [
        ...(error?.details.map((err) => `${err.context.label || err.path.join(".")}: ${err.message}`) || []),
        ...missingFiles.map((file) => `${file} is required`),
      ],
    });
  }

  next();
};

// Login Validation Middleware
const loginValidation = (req, res,next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(4).max(100).required(),
  });

  const { error } = schema.validate(req.body,{abortEarly:false});

  if (error) {
    return res.status(400).json({
      message: "Bad Request",
      errors: error.details.map((err) => `${err.context.label || err.path.join(".")}: ${err.message}`),
    });
  }

  next();
};

// Export both middlewares
module.exports = {
  signupValidation,
  loginValidation,
};
