import { body, param, validationResult, matchedData } from "express-validator";
import * as Order from "../models/order.js";
import nodemailer from 'nodemailer';

export const orderValidator = () => [
  body("name").trim().notEmpty().withMessage("Vardas yra privalomas").escape(),
  body("email").trim().notEmpty().withMessage("El. paštas yra privalomas").isEmail().withMessage("Neteisingas el. pašto formatas").escape(),
  body("phone").optional().trim().escape(),
  body("cake_type").optional().trim().escape(),
  body("cake_size").optional().trim().escape(),
  body("cake_flavor").optional().trim().escape(),
  body("decoration").optional().trim().escape(),
  body("delivery_date").optional().trim().escape(),
  body("delivery_time").optional().trim().escape(),
  body("message").optional().trim().escape(),
];

export const statusValidator = () => [
  body("status").trim().notEmpty().withMessage("Statusas yra privalomas")
    .isIn(['new', 'confirmed', 'in_progress', 'completed', 'cancelled']).withMessage("Neteisingas statusas"),
];

export const index = async (req, res, next) => {
  try {
    const orders = await Order.selectAll();
    res.json(orders || []);
  } catch (err) {
    res.status(500);
    next({ message: "Serverio klaida" });
  }
};

export const stats = async (req, res, next) => {
  try {
    const statistics = await Order.getStats();
    res.json(statistics);
  } catch (err) {
    res.status(500);
    next({ message: "Serverio klaida" });
  }
};

// GET /orders/:id
export const show = async (req, res, next) => {
  try {
    const order = await Order.selectById(req.params.id);
    if (!order) {
      res.status(404);
      return next({ message: "Užsakymas nerastas" });
    }
    res.json(order);
  } catch (err) {
    res.status(500);
    next({ message: "Serverio klaida" });
  }
};

// POST /orders
export const store = async (req, res, next) => {
  const validation = validationResult(req);
  
  if (!validation.isEmpty()) {
    res.status(400);
    return next({ message: "Duomenų klaida", errors: validation.array() });
  }

  const data = matchedData(req);
  
  try {
    const insertId = await Order.insert(data);
    
    if (!insertId) {
      res.status(500);
      return next({ message: "Nepavyko sukurti užsakymo" });
    }

    await sendOrderEmail(data, insertId);

    res.status(201).json({
      status: "success",
      message: "Užsakymas sukurtas sėkmingai",
      id: insertId
    });
  } catch (err) {
    console.error(err);
    res.status(500);
    next({ message: "Serverio klaida" });
  }
};

// PUT /orders/:id/status
export const updateStatus = async (req, res, next) => {
  const validation = validationResult(req);
  
  if (!validation.isEmpty()) {
    res.status(400);
    return next({ message: "Duomenų klaida", errors: validation.array() });
  }

  const { status } = matchedData(req);
  
  try {
    const success = await Order.updateStatus(req.params.id, status);
    
    if (!success) {
      res.status(404);
      return next({ message: "Užsakymas nerastas" });
    }

    res.json({ status: "success", message: "Statusas atnaujintas" });
  } catch (err) {
    res.status(500);
    next({ message: "Serverio klaida" });
  }
};

// DELETE /orders/:id
export const destroy = async (req, res, next) => {
  try {
    const success = await Order.destroy(req.params.id);
    
    if (!success) {
      res.status(404);
      return next({ message: "Užsakymas nerastas" });
    }

    res.json({ status: "success", message: "Užsakymas ištrintas" });
  } catch (err) {
    res.status(500);
    next({ message: "Serverio klaida" });
  }
};

// DELETE /orders/status/:status
export const deleteByStatus = async (req, res, next) => {
  const { status } = req.params;
  
  const validStatuses = ['new', 'confirmed', 'in_progress', 'completed', 'cancelled'];
  if (!validStatuses.includes(status)) {
    res.status(400);
    return next({ message: "Neteisingas statusas" });
  }
  
  try {
    const deletedCount = await Order.deleteByStatus(status);
    
    if (deletedCount === null) {
      res.status(500);
      return next({ message: "Serverio klaida" });
    }

    res.json({ 
      status: "success", 
      message: `Ištrinta užsakymų: ${deletedCount}`,
      deletedCount 
    });
  } catch (err) {
    res.status(500);
    next({ message: "Serverio klaida" });
  }
};

async function sendOrderEmail(data, orderId) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'nojusgencas@gmail.com',
        pass: process.env.EMAIL_PASS
      }
    });

    const adminMailOptions = {
      from: process.env.EMAIL_USER || 'nojusgencas@gmail.com',
      to: process.env.EMAIL_USER || 'nojusgencas@gmail.com',
      subject: `🎂 Naujas užsakymas #${orderId} - ${data.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #f59e0b, #ea580c); padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">🎂 Naujas užsakymas!</h1>
          </div>
          <div style="background: #fff; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 10px 10px;">
            <h2 style="color: #374151;">Užsakymo informacija #${orderId}</h2>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 10px 0; font-weight: bold; color: #6b7280;">Vardas:</td>
                <td style="padding: 10px 0;">${data.name}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 10px 0; font-weight: bold; color: #6b7280;">El. paštas:</td>
                <td style="padding: 10px 0;">${data.email}</td>
              </tr>
              ${data.phone ? `
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 10px 0; font-weight: bold; color: #6b7280;">Telefonas:</td>
                <td style="padding: 10px 0;">${data.phone}</td>
              </tr>` : ''}
              ${data.cake_type ? `
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 10px 0; font-weight: bold; color: #6b7280;">Torto tipas:</td>
                <td style="padding: 10px 0;">${data.cake_type}</td>
              </tr>` : ''}
              ${data.cake_size ? `
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 10px 0; font-weight: bold; color: #6b7280;">Dydis:</td>
                <td style="padding: 10px 0;">${data.cake_size}</td>
              </tr>` : ''}
              ${data.cake_flavor ? `
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 10px 0; font-weight: bold; color: #6b7280;">Skonis:</td>
                <td style="padding: 10px 0;">${data.cake_flavor}</td>
              </tr>` : ''}
              ${data.decoration ? `
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 10px 0; font-weight: bold; color: #6b7280;">Dekoracijos:</td>
                <td style="padding: 10px 0;">${data.decoration}</td>
              </tr>` : ''}
              ${data.delivery_date ? `
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 10px 0; font-weight: bold; color: #6b7280;">Pristatymo data:</td>
                <td style="padding: 10px 0;">${data.delivery_date}</td>
              </tr>` : ''}
              ${data.delivery_time ? `
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 10px 0; font-weight: bold; color: #6b7280;">Pristatymo laikas:</td>
                <td style="padding: 10px 0;">${data.delivery_time}</td>
              </tr>` : ''}
            </table>
            
            ${data.message ? `
            <div style="margin-top: 20px; padding: 15px; background: #f9fafb; border-radius: 8px;">
              <h3 style="margin: 0 0 10px 0; color: #374151;">Papildoma žinutė:</h3>
              <p style="margin: 0; color: #6b7280;">${data.message}</p>
            </div>` : ''}
            
            <div style="margin-top: 30px; text-align: center;">
              <a href="http://localhost:81/dashboard/orders" style="background: linear-gradient(135deg, #f59e0b, #ea580c); color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                Peržiūrėti Admin Panelėje
              </a>
            </div>
          </div>
        </div>
      `
    };

    const clientMailOptions = {
      from: process.env.EMAIL_USER || 'nojusgencas@gmail.com',
      to: data.email,
      subject: `🎂 Jūsų užsakymas priimtas - Kream`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #f59e0b, #ea580c); padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">🎂 Ačiū už užsakymą!</h1>
          </div>
          <div style="background: #fff; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px; color: #374151;">Sveiki, <strong>${data.name}</strong>!</p>
            <p style="color: #6b7280;">Jūsų užsakymas #${orderId} sėkmingai priimtas. Netrukus su jumis susisieksime dėl detalių.</p>
            
            <div style="margin: 30px 0; padding: 20px; background: #fef3c7; border-radius: 8px; text-align: center;">
              <p style="margin: 0; color: #92400e; font-weight: bold;">Užsakymo numeris: #${orderId}</p>
            </div>
            
            <p style="color: #6b7280;">Jei turite klausimų, susisiekite su mumis:</p>
            <p style="color: #6b7280;">📧 info@kream.lt<br>📞 +370 600 00000</p>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            
            <p style="text-align: center; color: #9ca3af; font-size: 14px;">
              © 2025 Kream. Visi teisės saugomos.
            </p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(clientMailOptions);
    
    console.log('Užsakymo el. laiškai išsiųsti sėkmingai');
  } catch (error) {
    console.error('Klaida siunčiant el. laišką:', error);
    // Nekelia klaidos, kad užsakymas vis tiek būtų sukurtas
  }
}
