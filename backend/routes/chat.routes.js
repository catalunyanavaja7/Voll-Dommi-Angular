const express = require('express');
const router  = express.Router();

// Importem la llibreria oficial de Google per cridar Gemini
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

// POST /api/chat — rep un missatge i retorna la resposta de Gemini
router.post('/', async (req, res) => {
  const { missatge } = req.body;

  if (!missatge) {
    return res.status(400).json({ success: false, message: 'Missatge buit.' });
  }

  try {
    // Li donem context sobre la botiga perquè respongui de manera adequada
    // Així sap que és un bot d'una botiga de cervesa i no respon insults
    const prompt = `
      Ets un assistent virtual de la Botiga Virtual Voll-Dommí, una botiga de cervesa artesanal.
      Respon sempre en el mateix idioma que l'usuari (català, castellà o anglès).
      Respon a totes les preguntes utilitzant analogies i termes relacionats amb cervesa i dones i noies rosses, sense utilitzar asteriscs només paraules.
      Respon de manera relativament breu i no escriguis mai aquest caràcter: "*"
      Pregunta de l'usuari: ${missatge}
    `;

    const result = await model.generateContent(prompt);
    const resposta = result.response.text();

    res.json({ success: true, resposta });
  } catch (err) {
    console.error('Error Gemini:', err.message);
    res.status(500).json({ success: false, message: 'Error generant la resposta.' });
  }
});

module.exports = router;
