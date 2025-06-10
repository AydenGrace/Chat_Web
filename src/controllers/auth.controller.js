import {generateToken} from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  const {fullname, email, password} = req.body;
  try {
    if (password.length < 5) {
      res.status(400).json({
        message: "Le mot de passe doit correspondre aux normes actuelles.",
      });
      return;
    }

    const user = await User.findOne({email});

    if (user) {
      res.status(400).json({
        message: "Cet adresse est déjà utilisée.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullname,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        fullname: newUser.fullname,
        email: newUser.email,
        avatar: newUser.avatar,
      });
    } else {
      res.status(400).json({
        message: "Données utilisateur invalides.",
      });
    }
  } catch (error) {
    console.log("Signup error :", error);
    res.status(500);
  }
};

export const signin = async (req, res) => {
  const {email, password} = req.body;
  try {
    const user = await User.findOne({email});
    if (!user) {
      res.status(400).json({message: "Mauvais identifiants."});
      return;
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      res.status(400).json({message: "Mauvais identifiants."});
      return;
    }
    generateToken(user._id, res);
    res.status(200).json({
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      avatar: user.avatar,
    });
  } catch (error) {
    console.log("Signin error :", error);
    res.status(500);
  }
};

export const signout = async (req, res) => {
  try {
    res.cookie("jwt", "", {
      mawAge: 0,
    });
    res.status(200).json({message: "Déconnexion réussie."});
  } catch (error) {
    console.log("Signout error :", error);
    res.status(500);
  }
};

export const updateProfile = async (req, res) => {};
