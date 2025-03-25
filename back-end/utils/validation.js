const Joi = require("joi");

const validate = (schema, data) => {
    const { error } = schema.validate(data, { abortEarly: false });
    if (!error) return null;

    return error.details.map(err => ({
        field: err.context.key,
        message: err.message
    }));
};

const loginSchema = Joi.object({
    username: Joi.string().pattern(/^[a-zA-Z0-9]+$/).required().messages({
        'string.pattern.base': 'Tên người dùng chỉ có thể chứa chữ cái và số',
        'any.required': 'Tên người dùng là bắt buộc'
    }),
    password: Joi.string().pattern(/^[a-zA-Z0-9]{6,15}$/).required().messages({
        'string.pattern.base': 'Mật khẩu phải dài từ 6 đến 15 ký tự và chỉ chứa chữ cái và số',
        'any.required': 'Mật khẩu là bắt buộc'
    })
});

const registerSchema = Joi.object({
    username: Joi.string().pattern(/^[a-zA-Z0-9]+$/).required().messages({
        'string.pattern.base': 'Tên người dùng chỉ có thể chứa chữ cái và số',
        'any.required': 'Tên người dùng là bắt buộc'
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Định dạng email không hợp lệ',
        'any.required': 'Email là bắt buộc'
    }),
    password: Joi.string().pattern(/^[a-zA-Z0-9]{6,15}$/).required().messages({
        'string.pattern.base': 'Mật khẩu phải dài từ 6 đến 15 ký tự và chỉ chứa chữ cái và số',
        'any.required': 'Mật khẩu là bắt buộc'
    })
});

const transactionSchema = Joi.object({
    amount: Joi.number().positive().precision(2).required()
        .messages({
            "number.base": "Amount must be a number.",
            "number.positive": "Amount must be greater than zero.",
            "number.precision": "Amount must have at most 2 decimal places.",
            "any.required": "Amount is required."
        }),

    paymentMethod: Joi.string().valid("credit_card", "paypal", "bank_transfer", "momo", "card").required()
        .messages({
            "any.only": "Invalid payment method. Allowed values: credit_card, paypal, bank_transfer.",
            "any.required": "Payment method is required."
        }),

    gateway: Joi.string().pattern(/^[a-zA-Z_]+$/).required()
    .messages({
        "string.pattern.base": "Gateway must only contain letters and underscores (no numbers or special characters).",
        "any.required": "Payment gateway is required."
    }),

});

const idSchema = Joi.string()
  .pattern(/^[a-zA-Z0-9]+$/) // Ensures only letters (A-Z, a-z) and numbers (0-9)
  .required()
  .messages({
    "string.pattern.base": "Invalid ID format. Must contain only letters and numbers.",
    "any.required": "ID is required."
  });

  const webhookDescriptionSchema = Joi.string()
  .pattern(/^[a-zA-Z0-9]+ [a-zA-Z0-9]+ [a-f0-9]{24}$/) // Match the format with spaces and alphanumeric/hexadecimal components
  .required()
  .messages({
    "string.pattern.base": "Invalid format. The string must be in the format 'alphanumeric alphanumeric hexadecimal'.",
    "any.required": "The string is required."
  });

module.exports = {
    validateLogin: (data) => validate(loginSchema, data),
    validateRegister: (data) => validate(registerSchema, data),
    validateTransaction: (data) => validate(transactionSchema, data),
    validateId: (data) => validate(idSchema, data),
    validateWebhookDescription: (data) => validate(webhookDescriptionSchema, data),
};
