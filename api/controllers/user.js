import * as userModel from "../models/user.js";
import bcrypt from "bcryptjs";

/* GET users listing. */
export const index = async (req, res, next) => {
  // gauname duomenis iš modelio
  let users = await userModel.selectAll();

  res.json(users);
};

export const show = async (req, res, next) => {
  // gauname duomenis iš modelio
  let user = await userModel.selectById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "404" });
  }

  res.json(user);
};

export const store = async (req, res, next) => {
  // validacija
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ message: "Trūksta duomenų" });
  }

  // slaptažodžio šifravimas (hash)
  req.body.password = await bcrypt.hash(req.body.password, 12);

  let userId = await userModel.insert(req.body);

  // tikrina ar pavyko įterpti
  if (!userId) {
    return res.status(500).json({ message: "Klaida kuriant vartotoją" });
  }

  res.status(201).json({ id: userId });
};

export const update = async (req, res, next) => {
  // validacija
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ message: "Trūksta duomenų" });
  }

  // slaptažodžio šifravimas (hash)
  req.body.password = await bcrypt.hash(req.body.password, 12);

  let success = await userModel.update(req.params.id, req.body);

  if (!success) {
    return res.status(500).json({ message: "Klaida atnaujinant vartotoją" });
  }

  res.json({ message: "Vartotojas atnaujintas" });
};

export const destroy = async (req, res, next) => {
  let success = await userModel.destroy(req.params.id);

  if (!success) {
    return res.status(500).json({ message: "Klaida trinant vartotoją" });
  }

  res.json({ message: "Vartotojas ištrintas" });
};

export const updatePassword = async (req, res, next) => {
  const userId = req.params.id;
  const { currentPassword, newPassword } = req.body;

  // validacija
  if (!newPassword) {
    res.status(400)
    return next({ message: "Trūksta slaptažodžio" });
  }

  const user = await userModel.selectById(userId);
  if (!user) {
    res.status(404)
    return next({ message: "Vartotojas nerastas" });
  }

  const match = await bcrypt.compare(currentPassword, user.password);
  if (!match) {
    res.status(401)
    return next({ message: "Neteisingas dabartinis slaptažodis" });
  }

  // slaptažodžio šifravimas (hash)
  const hashedPassword = await bcrypt.hash(newPassword, 12);

  let success = await userModel.updatePassword(userId, hashedPassword);

  if (!success) {
    res.status(500)
    return next({ message: "Klaida keičiant slaptažodį" });
  }

  res.json({ message: "Slaptažodis sėkmingai pakeistas" });
};

export const updateRole = async (req, res, next) => {
  const userId = req.params.id;
  
  const { role } = req.body;
  const success = await userModel.updateRole(userId, role);

  if (!success) {
    return res.status(500).json({ message: "Klaida keičiant vartotojo rolę" });
  }

  res.json({ message: "Vartotojo rolė sėkmingai pakeista" });
};

export const updateStatus = async (req, res, next) => {
  const userId = req.params.id;
  const { status } = req.body;
  const success = await userModel.updateStatus(userId, status);

  if (!success) {
    return res.status(500).json({ message: "Klaida keičiant vartotojo būseną" });
  }
  res.json({ message: "Vartotojo būsena sėkmingai pakeista" });
};

// Admin: update user email
export const updateEmail = async (req, res, next) => {
  const userId = req.params.id;
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Trūksta el. pašto adreso" });
  }

  // Check if email is already taken by another user
  const existingUser = await userModel.selectByEmail(email);
  if (existingUser && existingUser.id !== parseInt(userId)) {
    return res.status(400).json({ message: "Šis el. pašto adresas jau užimtas" });
  }

  const success = await userModel.updateEmail(userId, email);

  if (!success) {
    return res.status(500).json({ message: "Klaida keičiant el. paštą" });
  }
  res.json({ message: "El. paštas sėkmingai pakeistas" });
};

// Admin: reset user password (without knowing the current one)
export const adminResetPassword = async (req, res, next) => {
  const userId = req.params.id;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: "Trūksta naujo slaptažodžio" });
  }

  if (password.length < 4) {
    return res.status(400).json({ message: "Slaptažodis per trumpas (min. 4 simboliai)" });
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(password, 12);

  const success = await userModel.adminResetPassword(userId, hashedPassword);

  if (!success) {
    return res.status(500).json({ message: "Klaida keičiant slaptažodį" });
  }
  res.json({ message: "Slaptažodis sėkmingai pakeistas" });
};