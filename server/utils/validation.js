const Joi = require("joi");

const validate = (schema, data) => {
  const { error } = schema.validate(data, { abortEarly: false });
  if (!error) return null;

  return error.details.map((err) => ({
    field: err.context.key,
    message: err.message,
  }));
};

const loginSchema = Joi.object({
  username: Joi.string()
    .pattern(/^[a-zA-Z0-9]+$/)
    .required()
    .messages({
      "string.pattern.base": "Tên người dùng chỉ có thể chứa chữ cái và số",
      "any.required": "Tên người dùng là bắt buộc",
    }),
  password: Joi.string()
    .pattern(/^[a-zA-Z0-9]{6,15}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Mật khẩu phải dài từ 6 đến 15 ký tự và chỉ chứa chữ cái và số",
      "any.required": "Mật khẩu là bắt buộc",
    }),
});

const registerSchema = Joi.object({
  username: Joi.string()
    .pattern(/^[a-zA-Z0-9]+$/)
    .required()
    .messages({
      "string.pattern.base": "Tên người dùng chỉ có thể chứa chữ cái và số",
      "any.required": "Tên người dùng là bắt buộc",
    }),
  email: Joi.string().email().required().messages({
    "string.email": "Định dạng email không hợp lệ",
    "any.required": "Email là bắt buộc",
  }),
  password: Joi.string()
    .pattern(/^[a-zA-Z0-9]{6,15}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Mật khẩu phải dài từ 6 đến 15 ký tự và chỉ chứa chữ cái và số",
      "any.required": "Mật khẩu là bắt buộc",
    }),
});

const transactionSchema = Joi.object({
  amount: Joi.number().positive().precision(2).required().messages({
    "number.base": "Amount must be a number.",
    "number.positive": "Amount must be greater than zero.",
    "number.precision": "Amount must have at most 2 decimal places.",
    "any.required": "Amount is required.",
  }),

  paymentMethod: Joi.string()
    .valid("credit_card", "paypal", "bank_transfer", "momo", "card")
    .required()
    .messages({
      "any.only":
        "Invalid payment method. Allowed values: credit_card, paypal, bank_transfer.",
      "any.required": "Payment method is required.",
    }),

  gateway: Joi.string()
    .pattern(/^[a-zA-Z_]+$/)
    .required()
    .messages({
      "string.pattern.base":
        "Gateway must only contain letters and underscores (no numbers or special characters).",
      "any.required": "Payment gateway is required.",
    }),
});

const idSchema = Joi.string()
  .pattern(/^[a-zA-Z0-9]+$/) // Ensures only letters (A-Z, a-z) and numbers (0-9)
  .required()
  .messages({
    "string.pattern.base":
      "Invalid ID format. Must contain only letters and numbers.",
    "any.required": "ID is required.",
  });

const webhookDescriptionSchema = Joi.string()
  .pattern(/^[a-zA-Z0-9]+ [a-zA-Z0-9]+ [a-f0-9]{24}$/) // Match the format with spaces and alphanumeric/hexadecimal components
  .required()
  .messages({
    "string.pattern.base":
      "Invalid format. The string must be in the format 'alphanumeric alphanumeric hexadecimal'.",
    "any.required": "The string is required.",
  });

const productValidationSchema = Joi.object({
  product_name: Joi.string().min(3).max(255).required().messages({
    "string.empty": "Tên sản phẩm không được để trống.",
    "string.min": "Tên sản phẩm phải có ít nhất {#limit} ký tự.",
    "string.max": "Tên sản phẩm không được vượt quá {#limit} ký tự.",
    "any.required": "Tên sản phẩm là bắt buộc.",
  }),

  product_description: Joi.string().allow("").max(1000).messages({
    "string.max": "Mô tả sản phẩm không được vượt quá {#limit} ký tự.",
  }),

  product_type: Joi.string()
    .valid("topup_package", "game_account", "utility_account")
    .required()
    .messages({
      "any.only":
        "Loại sản phẩm chỉ có thể là 'topup_package' hoặc 'game_account'.",
      "any.required": "Loại sản phẩm là bắt buộc.",
    }),

  product_category: Joi.string().min(3).max(255).required().messages({
    "string.empty": "Danh mục sản phẩm không được để trống.",
    "string.min": "Danh mục sản phẩm phải có ít nhất {#limit} ký tự.",
    "string.max": "Danh mục sản phẩm không được vượt quá {#limit} ký tự.",
    "any.required": "Danh mục sản phẩm là bắt buộc.",
  }),

  product_status: Joi.string()
    .valid("active", "inactive")
    .default("active")
    .messages({
      "any.only": "Trạng thái sản phẩm chỉ có thể là 'active' hoặc 'inactive'.",
    }),

  product_stock: Joi.number().integer().min(0).required().messages({
    "number.base": "Số lượng sản phẩm phải là số nguyên.",
    "number.min": "Số lượng sản phẩm không thể nhỏ hơn {#limit}.",
    "any.required": "Số lượng sản phẩm là bắt buộc.",
  }),
  product_price: Joi.number().integer().required().messages({
    "number.base": "Giá sản phẩm phải là số nguyên.",
    "number.min": "Giá sản phẩm không thể nhỏ hơn {#limit}.",
    "any.required": "Giá sản phẩm là bắt buộc.",
  }),
});

const productAttributesSchema = Joi.object({
  product_type: Joi.string()
    .valid("game_account", "topup_package", "utility_account")
    .required(),

  productAttributes: Joi.when("product_type", {
    is: "topup_package",
    then: Joi.array()
      .items(
        Joi.object({
          name: Joi.string()
            .pattern(/^[a-zA-Z0-9\s]+$/)
            .required()
            .messages({
              "string.pattern.base":
                "Name can only contain letters and numbers.",
            }),
          price: Joi.number().required().messages({
            "number.base": "Price must be a number.",
          }),
        })
      )
      .min(1)
      .required(),

    otherwise: Joi.when("product_type", {
      is: "utility_account",
      then: Joi.array()
        .items(
          Joi.object({
            username: Joi.string()
              .pattern(/^[a-zA-Z0-9\s]+$/)
              .required()
              .messages({
                "string.pattern.base":
                  "Username can only contain letters and numbers.",
              }),
            password: Joi.string()
              .pattern(/^[a-zA-Z0-9\s]+$/)
              .required()
              .messages({
                "string.pattern.base":
                  "Password can only contain letters and numbers.",
              }),
          })
        )
        .min(1)
        .required(),
      otherwise: Joi.allow(), // Explicitly disallow other values
    }),
  }),
});

const productUpdateValidationSchema = Joi.object({
  productName: Joi.string().min(3).max(255).required(),
  productDescription: Joi.string().max(1000).optional(),
  productStatus: Joi.string().valid("active", "inactive").required(),
});

const productSlugSchema = Joi.object({
  product_slug: Joi.string()
    .pattern(/^[a-zA-Z0-9-]+$/) // Only allows letters, numbers, and hyphens (-)
    .min(3) // Minimum length of 3 characters
    .max(50) // Maximum length of 50 characters
    .required(), // Required field
});

const updateUserForAdminSchema = Joi.object({
    fullName: Joi.string().trim().required().messages({
      'string.empty': 'Họ tên đầy đủ là bắt buộc',
      'any.required': 'Họ tên đầy đủ là bắt buộc',
    }),

    email: Joi.string().email({ tlds: { allow: false } }).required().messages({
      'string.empty': 'Email là bắt buộc',
      'any.required': 'Email là bắt buộc',
      'string.email': 'Email không hợp lệ',
    }),
    newPassword: Joi.string().min(6).optional().messages({
      'string.min': 'Mật khẩu phải có ít nhất 6 ký tự',
    }),
});
  
const createDiscountSchema = Joi.object({
  code: Joi.string().trim().uppercase().required(),
  discount_type: Joi.string().valid('fixed', 'percentage').required(),
  discount_value: Joi.number().positive().required(),
  start_date: Joi.date().required(),
  end_date: Joi.date().greater(Joi.ref('start_date')).required(),
  isActive: Joi.boolean().optional()
});

module.exports = {
  validateLogin: (data) => validate(loginSchema, data),
  validateRegister: (data) => validate(registerSchema, data),
  validateTransaction: (data) => validate(transactionSchema, data),
  validateId: (data) => validate(idSchema, data),
  validateWebhookDescription: (data) =>
    validate(webhookDescriptionSchema, data),
  validateProduct: (data) => validate(productValidationSchema, data),
  validateProductAttributes: (data) => validate(productAttributesSchema, data),
  validateProductUpdate: (data) =>
    validate(productUpdateValidationSchema, data),
    validateProductSlug: (data) => validate(productSlugSchema, data),
  validateUpdateUserForAdmin: (data) => validate(updateUserForAdminSchema, data),
    validateCreateDiscountForAdmin: (data) => validate(createDiscountSchema, data),
};
