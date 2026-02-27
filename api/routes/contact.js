import express from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

// POST /contact - send email
router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Visi laukai yra privalomi' });
  }

  try {
    // Create transporter for Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'nojusgencas@gmail.com',
        pass: process.env.EMAIL_PASS
      }
    });

    // Email options
    const mailOptions = {
      from: 'nojusgencas@gmail.com',
      to: 'nojusgencas@gmail.com',
      subject: `Nauja žinutė iš svetainės nuo ${name}`,
      html: `
        <h2>Nauja žinutė iš kontaktinės formos</h2>
        <p><strong>Vardas:</strong> ${name}</p>
        <p><strong>El. paštas:</strong> ${email}</p>
        <p><strong>Žinutė:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.json({ message: 'Žinutė išsiųsta sėkmingai į Gmail' });
  } catch (error) {
    console.error('Klaida siunčiant el. laišką:', error);
    res.status(500).json({ error: 'Nepavyko išsiųsti žinutės' });
  }
});

export default router;