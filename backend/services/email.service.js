const nodemailer = require('nodemailer');
require('dotenv').config();

//Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

//Verificació en arrencar
transporter.verify((err) => {
  if (err) {
    console.warn('⚠️   Nodemailer: no s\'ha pogut verificar la connexió SMTP:', err.message);
  } else {
    console.log('preparat per enviar correus');
  }
});

const wrapHtml = (title, body) => `
<!DOCTYPE html>
<html lang="ca">
<head>
  <meta charset="UTF-8"/>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;600&display=swap');
    * { margin:0; padding:0; box-sizing:border-box; }
    body {
      font-family: 'Oswald', Arial, sans-serif;
      background: #f0f0f0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 1px 1px 5px 2px lightgrey;
    }
    .header {
      background: #334c71;
      padding: 28px 36px;
    }
    .header h1 {
      color: #f7cb54;
      font-size: 28px;
      font-weight: 600;
      letter-spacing: 1px;
    }
    .header p {
      color: rgba(255,255,255,0.6);
      font-size: 13px;
      margin-top: 4px;
      font-weight: 300;
    }
    .body {
      padding: 36px;
      color: #333;
      line-height: 1.7;
      font-size: 16px;
      font-weight: 300;
    }
    .body h2 {
      font-size: 22px;
      color: #334c71;
      margin-bottom: 20px;
      font-weight: 600;
    }
    .body p {
      margin-bottom: 14px;
    }
    .password-box {
      background: #f7f7f7;
      border-left: 4px solid #f7cb54;
      padding: 14px 20px;
      font-size: 22px;
      font-weight: 600;
      letter-spacing: 3px;
      color: #334c71;
      border-radius: 0 6px 6px 0;
      display: inline-block;
      margin: 10px 0 20px 0;
    }
    .btn {
      display: inline-block;
      margin: 20px 0;
      padding: 13px 32px;
      background: linear-gradient(to bottom, #f7cb54, #C9A644);
      color: #333;
      text-decoration: none;
      border-radius: 10px;
      font-size: 16px;
      font-weight: 600;
      font-family: 'Oswald', Arial, sans-serif;
    }
    .link-box {
      word-break: break-all;
      font-size: 12px;
      color: #888;
      background: #f7f7f7;
      padding: 10px 14px;
      border-radius: 6px;
      margin-top: 8px;
    }
    .footer {
      padding: 16px 36px;
      font-size: 12px;
      color: #aaa;
      border-top: 1px solid #eee;
      font-weight: 300;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Voll Dommi</h1>
      <p><i>Niño, tráeme otra que la garganta se me está secando</i></p>
    </div>
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
    `<p>Hola, <strong>${userName}</strong>.</p>
     <p>Hem rebut una sol·licitud per restablir la teva contrasenya. La teva nova contrasenya temporal és:</p>
     <div class="password-box">${newPassword}</div>
     <p>Accedeix al teu compte i canvia-la des del perfil.</p>`
  );

  await transporter.sendMail({
    from: `"Voll Dommi" <${process.env.EMAIL_USER}>`,
    to:   toEmail,
    subject: 'Restabliment de contrasenya - Voll Dommi',
    html,
  });

  console.log(`Correu de reset enviat a ${toEmail}`);
};

const sendVerificationEmail = async (toEmail, userName, verifyToken) => {
  const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verifyToken}`;

  const html = wrapHtml(
    'Verifica el teu correu',
    `<p>Hola, <strong>${userName}</strong>. Benvingut/da a Voll Dommi.</p>
     <p>Per completar el registre, verifica la teva adreça de correu electrònic:</p>
     <a class="btn" href="${verifyUrl}">Verificar correu</a>
     <p>O copia aquest enllaç al navegador:</p>
     <div class="link-box">${verifyUrl}</div>
     <p style="margin-top:16px; font-size:14px; color:#888;">L'enllaç caduca en 24 hores.</p>`
  );

  await transporter.sendMail({
    from: `"Voll Dommi" <${process.env.EMAIL_USER}>`,
    to:   toEmail,
    subject: 'Verifica el teu correu - Voll Dommi',
    html,
  });

  console.log(`Correu de verificació enviat a ${toEmail}`);
};

module.exports = { sendPasswordResetEmail, sendVerificationEmail };
