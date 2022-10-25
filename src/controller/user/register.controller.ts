/* eslint-disable no-useless-escape */
import jwt from "jsonwebtoken";
import validator from "email-validator";
import User from "../../modal/user";
import sendEmail from "../../services/sendEmail";
import logger from "../../logger";

const register = async (req, res) => {
  try {
    const registerData = req.body;

    if (!registerData.email) {
      logger.error("Please enter a your email");
      throw new Error("Please enter a your email");
    } else {
      if (!validator.validate(registerData.email)) {
        logger.error("Please enter a valid email");
        throw new Error("Please enter a valid email");
      } else {
        const user_count = await User.find({ email: registerData.email });
        if (user_count.length != 0) {
          logger.error("User already exist");
          throw new Error("User already exist");
        } else {
          if (user_count.length != 0) {
            logger.error("This Email is already assiociate with us");
            throw new Error("This Email is already assiociate with us");
          }
        }
      }
    }

    if (!registerData.phone) {
      logger.error("Please enter your phone number");
      throw new Error("Please enter your phone number");
    } else {
      const user_count = await User.find({ phone: registerData.phone });
      if (user_count.length != 0) {
        logger.error("Phone number already in use");
        throw new Error("Phone number already in use");
      }
    }

    const isNonWhiteSpace = /^\S*$/;
    if (!isNonWhiteSpace.test(registerData.password)) {
      logger.error("Password must not contain Whitespaces.");
      throw new Error("Password must not contain Whitespaces.");
    }

    const isContainsUppercase = /^(?=.*[A-Z]).*$/;
    if (!isContainsUppercase.test(registerData.password)) {
      logger.error("Password must have at least one Uppercase Character.");
      throw new Error("Password must have at least one Uppercase Character.");
    }

    const isContainsLowercase = /^(?=.*[a-z]).*$/;
    if (!isContainsLowercase.test(registerData.password)) {
      logger.error("Password must have at least one Lowercase Character.");
      throw new Error("Password must have at least one Lowercase Character.");
    }

    const isContainsNumber = /^(?=.*[0-9]).*$/;
    if (!isContainsNumber.test(registerData.password)) {
      logger.error("Password must contain at least one Digit.");
      throw new Error("Password must contain at least one Digit.");
    }

    const isContainsSymbol =
      /^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).*$/;
    if (!isContainsSymbol.test(registerData.password)) {
      logger.error("Password must contain at least one Special Symbol.");
      throw new Error("Password must contain at least one Special Symbol.");
    }

    const isValidLength = /^.{6,16}$/;
    if (!isValidLength.test(registerData.password)) {
      logger.error("Password must be 6-16 Characters Long.");
      throw new Error("Password must be 6-16 Characters Long.");
    }

    if (registerData.password != registerData.confirmPassword) {
      logger.error("Password and confirm Password dosen't match");
      throw new Error("Password and confirm Password dosen't match");
    }

    const user = new User({ ...req.body });
    let data = await user.save();

    data = JSON.parse(JSON.stringify(data));

    await sendEmail(
      data.email,
      "Congratulations Account Created Successfully",
      "Congratulations your account is created. Please add your professional info and wait for the admin approval."
    );

    const response = await User.findByIdAndUpdate(data._id, { new: true });

    const token = jwt.sign({ _id: data._id }, process.env.JWT_SECRET, {
      // expiresIn: "1d",
    });
    logger.info({
      status: 200,
      type: "success",
      message: "User Registration Successfully",
      data: {
        ...response.toObject(),
        token: token,
      },
    });
    res.status(200).json({
      status: 200,
      type: "success",
      message: "User Registration Successfully",
      data: {
        ...response.toObject(),
        token: token,
      },
    });
  } catch (error) {
    logger.error(error.message);
    res.status(400).json({
      status: 400,
      type: "error",
      message: error.message,
    });
  }
};

export default register;
