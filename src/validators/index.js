import { body } from "express-validator"

// writing validation code: to check if they follow the below conditions then they valid.
const userRegisterValidator = () => {
    return [
        body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Email is invalid"),

        body("username")
        .trim()
        .notEmpty()
        .withMessage("Username is required")
        .isLowercase()
        .withMessage("Username must be in lower case")
        .isLength({min: 3})
        .withMessage("Username must be at least 3 characters long"),

        body("password")
        .trim()
        .notEmpty()
        .withMessage("Pasword is required"),

        body("fullName")
        .optional()
        .trim()
    ]
}

const userLoginValidator = () => {
    return[
        body("email")
            .optional()
            .isEmail()
            .withMessage("Email is invalid"),

        body("password")
            .notEmpty()
            .withMessage("Password is required"),


    ]
}

export {
    userRegisterValidator,
    userLoginValidator
}