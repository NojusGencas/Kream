import {
  body,
  param,
  validationResult,
  matchedData,
} from "express-validator";

import * as User from "../models/user.js";

import bcryptjs from "bcryptjs";

import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const { JWT_SECRET } = process.env;

import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

if (!JWT_SECRET) throw new Error("JWT_SECRET nėra nustatytas .env faile!");

// JWT autentifikacijos strategija
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET,
    },
    async (jwt_payload, done) => {
      try {
        const user = await User.selectById(jwt_payload.id);
        if (!user) return done(null, false);
        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

export const isAuth = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, function (err, user, info) {   
    if (user) {
      req.user = user;
      return next();
    }
    res.status(401);
    return next({message: "Unauthorized"});
  })(req, res, next);
};

export const isAdmin = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, function (err, user, info) {
    if (user && user.roleId === 3) {
      req.user = user;
      return next();
    }
    res.status(401);
    return next({message: "Unauthorized"});
  })(req, res, next);
};

export const authValidator = () => [
  body("email").trim().notEmpty().withMessage("El. paštas yra privalomas").isEmail().withMessage("Neteisingas el. pašto formatas").escape(),
  body("password").trim().notEmpty().withMessage("Slaptažodis yra privalomas").escape(),
];

// POST /register
export const register = async (req, res, next) => {
  const validation = validationResult(req);

  if (!validation.isEmpty()) {
    res.status(400);
    return next({message: "Duomenų klaida", errors: validation.array()});
  }

  const data = matchedData(req);

  const existingEmail = await User.selectByEmail(data.email);
  if (existingEmail) {
    res.status(400);
    return next({message: "El. paštas jau užregistruotas"});
  }

  data.password = await bcryptjs.hash(data.password, 10);

  let insertId = await User.insert(data);

  if (!insertId) {
    res.status(500);
    return next({message: "Nepavyko sukurti vartotojo"});
  }

  res.status(201).json({
    status: "success",
    message: "Vartotojas užregistruotas",
    id: insertId,
  });
};

// POST /login
export const login = async (req, res, next) => {
  const validation = validationResult(req);

  if (!validation.isEmpty()) {
    res.status(400);
    return next({message: "Duomenų klaida", errors: validation.array()});
  }

  const data = matchedData(req);

  const user = await User.selectByEmail(data.email);
  if (!user) {
    res.status(401);
    return next({message: "Neteisingi prisijungimo duomenys"});
  }

  const match = await bcryptjs.compare(data.password, user.password);
  if (!match) {
    res.status(401);
    return next({message: "Neteisingi prisijungimo duomenys"});
  }

  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1w" });

  const safeUser = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  res.status(200).json({ status: "success", user: safeUser, token });
};
