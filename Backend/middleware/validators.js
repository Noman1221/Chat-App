import { body, validationResult } from "express-validator";

export const validate = (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ success: false, error: error.array() });
    };
    next()
};

export const ValidateSignUp = [
    body("fullname").trim().notEmpty().withMessage("name is required"),
    body("email").trim().isEmail().withMessage("email is not valid"),
    body("password").notEmpty().isLength({ min: 6 }).withMessage("Password is required"),
]