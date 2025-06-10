import cloudinary from "../lib/cloudinary.js";
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

export const updateProfile = async (req, res) => {
  try {
    const {avatar} = req.body;
    const userId = req.user._id;

    if (!avatar)
      return res.status(400).json({message: "Une image doit être fournie."});

    if (!userId) return res.status(401).json({message: "utilisateur inconnu."});

    const uploadResponse = await cloudinary.uploader.upload(avatar);

    if (!uploadResponse.secure_url)
      return res
        .status(500)
        .json({message: "Une erreur est survenue lors de l'upload."});

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        avatar: uploadResponse.secure_url,
      },
      {new: true}
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("updateProfile error :", error);
    res.status(500);
  }
};

export const checkAuth = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("CheckAuth error :", error);
    res.status(500);
  }
};
