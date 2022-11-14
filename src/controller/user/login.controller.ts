import jwt from "jsonwebtoken";
import User from "../../modal/user";
import bcrypt from "bcryptjs";
import logger from "../../logger";

const login = async (req, res) => {
  const { email, password } = req.body;
  const verifiedEmail = email.toLowerCase();
  try {
    User.findOne({
      email: verifiedEmail,
    }).exec((err, user) => {
      if (err) {
        logger.error({
          type: "error",
          status: 400,
          message: err,
        });
        res.status(400).send({
          type: "error",
          status: 400,
          message: err,
        });
        return;
      }
      if (!user) {
        logger.error({
          type: "error",
          status: 400,
          message: "User Not Found",
        });
        return res.status(400).send({
          type: "error",
          status: 400,
          message: "User Not Found",
        });
      }

      const passwordIsValid = bcrypt.compareSync(password, user.password);

      if (!passwordIsValid) {
        logger.error({
          type: "error",
          status: 400,
          message: "Invalid Password!",
        });
        return res.status(400).send({
          type: "error",
          status: 400,
          message: "Invalid Password!",
        });
      }

      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        // expiresIn: 86400, //24 hours
      });

      res.status(200).json({
        type: "success",
        status: 200,
        message: "User Successfully Logged-In",
        data: {
          ...user.toObject(),
          token: token,
        },
      });

      // logger.info({
      //   type: "success",
      //   status: 200,
      //   message: "User Successfully Logged-In",
      //   data: {
      //     ...user.toObject(),
      //     token: token,
      //   },
      // });
    });
  } catch (error) {
    logger.error(error.message);
    return res.status(404).json({
      type: "error",
      status: 404,
      message: error.message,
    });
  }
};

export default login;
