const User = require("../models/user");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

exports.signup = async (req, res) => {
  try {
    const user = await new User(req.body);
    console.log(req.body);

    await user.save((err, user) => {
      if (err) {
        return res.status(400).json({
          error: "Email is taken",
        });
      }
      res.status(200).json({
        user,
      });
    });
  } catch (err) {
    console.error(err.message);
  }
};

exports.signin = (req, res) => {
  const {
    email,
    password
  } = req.body;
  User.findOne({
      email,
    },
    (err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: "invalid credentials",
        });
      }
      if (!user.authenticate(password)) {
        return res.status(401).json({
          error: "Email and password and does not match",
        });
      }
      const token = jwt.sign({
          _id: user._id,
        },
        process.env.JWT_SECRET
      );
      res.cookie("t", token, {
        expire: new Date() + 9999,
      });
      const {
        _id,
        name,
        email,
        role
      } = user;
      return res.json({
        token,
        user: {
          _id,
          email,
          name,
          role,
        },
      });
    }
  );
};

exports.signout = (req, res) => {
  res.clearcookie("t");
  res.json({
    message: "Successfully Signout",
  });
};

// exports.requireSignin = expressJwt({
//   secret: process.env.JWT_SECRET,
//   userProperty: "auth",
// });

exports.userbyId = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "user not found",
      });
    }
    req.profile = user;
    next();
  });
};

exports.read = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.json(profile);
};

exports.update = (req, res) => {
  const {
    name,
    password
  } = req.body;
  User.findOne({
    _id: req.body._id
  }, (err, res) => {
    if (err || !user) {
      return res.status(400).json({
        error: "user not found",
      });
    }
    if (!name) {
      return res.status(400).json({
        error: "Name is required",
      });
    } else {
      user.name = name;
    }
    if (!password) {
      if (password.length < 6) {
        return res.status(400).json({
          error: "Password is required",
        });
      }
    }
    user.save((upadateduser, err) => {
      if (err) {
        console.log("update user error", err);
      }
    });
    upadateduser.hashed_password = undefined;
    upadateduser.salt = undefined;
    res.json(upadateduser);
  });
};