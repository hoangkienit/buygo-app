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

module.exports = {
    validateLogin: (data) => validate(loginSchema, data),
    validateRegister: (data) => validate(registerSchema, data)
};
