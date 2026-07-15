// Route de chat pour JOVA AI.
// Reçoit les messages du frontend, appelle l'API Anthropic avec la clé secrète
// (stockée côté serveur, jamais exposée au navigateur), et renvoie la réponse.

const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');

const router = express.Router();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT =
  "Tu es JOVA AI, l'assistant intelligent de JOVA, une entreprise technologique basée à " +
  "Goma, en RDC, créatrice de Masolo (application de messagerie) et d'autres produits " +
  "numériques à venir. Réponds en français, de façon chaleureuse, claire et directe, sans " +
  "jargon inutile. Garde tes réponses concises (2-4 phrases sauf si on te demande plus de détails).";

// POST /api/jova-ai/chat
// body attendu : { messages: [{ role: "user", content: "..." }, ...] }
router.post('/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages manquant ou invalide' });
    }

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 400,
      system: SYSTEM_PROMPT,
      messages,
    });

    const reply = response.content
      .map((block) => block.text || '')
      .join('')
      .trim();

    res.json({ reply });
  } catch (err) {
    console.error('Erreur JOVA AI:', err);
    res.status(500).json({ error: "Impossible de contacter JOVA AI pour le moment." });
  }
});

module.exports = router;
