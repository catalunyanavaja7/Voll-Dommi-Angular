

const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((err) => {
  if (err) {
    console.warn('no s\'ha pogut verificar la connexió SMTP:', err.message);
  } else {
    console.log(' preparat per enviar correus');
  }
});

const wrapHtml = (title, body) => `
<!DOCTYPE html>
<html lang="ca">
<head>
  <meta charset="UTF-8"/>
  <style>
    body { font-family: Arial, sans-serif; background:#f4f4f4; margin:0; padding:0; }
    .container { max-width:600px; margin:40px auto; background:#fff;
                 border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,.1); }
    .header    { background:#3f51b5; color:#fff; padding:24px 32px; }
    .header h1 { margin:0; font-size:22px; }
    .body      { padding:32px; color:#333; line-height:1.6; }
    .btn       { display:inline-block; margin:24px 0; padding:12px 28px;
                 background:#3f51b5; color:#fff; text-decoration:none;
                 border-radius:4px; font-size:15px; }
    .footer    { padding:16px 32px; font-size:12px; color:#888; border-top:1px solid #eee; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header"><h1>🛒 Voll Dommi</h1></div>
    <div class="body">
      <h2>${title}</h2>
      ${body}
    </div>
    <div class="footer">Si no has sol·licitat aquest correu, ignora'l.</div>
  </div>
</body>
</html>`;


const sendPasswordResetEmail = async (toEmail, userName, newPassword) => {
  const html = wrapHtml(
    'Restabliment de contrasenya',
    `<p>Hola, <strong>${userName}</strong>!</p>
     <p>Has sol·licitat restablir la teva contrasenya.</p>
     <p>La teva nova contrasenya temporal és:</p>
     <p style="font-size:20px; font-weight:bold; letter-spacing:2px;
                background:#f0f0f0; padding:12px 20px; border-radius:4px;
                display:inline-block;">${newPassword}</p>
     <p>Inicia sessió i canvia-la des del teu perfil el més aviat possible.</p>`
  );

  await transporter.sendMail({
    from: `"Voll Dommi Botiga" <${process.env.EMAIL_USER}>`,
    to:   toEmail,
    subject: 'La teva nova contrasenya temporal – Voll Dommi',
    html,
  });

  console.log(`Correu de reset enviat a ${toEmail}`);
};


const sendVerificationEmail = async (toEmail, userName, verifyToken) => {
  const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verifyToken}`;

  const html = wrapHtml(
    'Verifica el teu correu',
    `<p>Hola, <strong>${userName}</strong>! Benvingut/da a <strong>Voll Dommi</strong>.</p>
     <p>Clica el botó per verificar la teva adreça de correu electrònic:</p>
     <a class="btn" href="${verifyUrl}">Verificar correu</a>
     <p>O copia aquest enllaç al navegador:</p>
     <p style="word-break:break-all; font-size:13px; color:#666;">${verifyUrl}</p>
     <p>L'enllaç caduca en <strong>24 hores</strong>.</p>`
  );

  await transporter.sendMail({
    from: `"Voll Dommi Botiga" <${process.env.EMAIL_USER}>`,
    to:   toEmail,
    subject: 'Verifica el teu correu – Voll Dommi',
    html,
  });

  console.log(`Correu de verificació enviat a ${toEmail}`);
};

module.exports = { sendPasswordResetEmail, sendVerificationEmail };
