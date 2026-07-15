# JOVA AI — Backend

Petit serveur Express qui sert de proxy sécurisé entre `jova-ai.html` et l'API Claude
d'Anthropic. Il cache ta clé API et évite qu'elle soit visible dans le navigateur.

## Fichiers

- `server.js` — démarre le serveur
- `routes/jova-ai.js` — la route `POST /api/jova-ai/chat`
- `package.json` — dépendances
- `.env.example` — exemple de variables d'environnement (à copier en `.env` en local)

## Déploiement sur Render (comme Masolo)

1. **Créer un nouveau repo GitHub** (par ex. `jova-ai-backend`) et y pousser tout ce dossier.
   - Sur GitHub → *Add file* → *Upload files*, glisse tous les fichiers de `jova-ai-backend/`
     (garde la structure : `routes/jova-ai.js` doit rester dans un dossier `routes`).
   - Ne mets **pas** `.env` sur GitHub — seulement `.env.example`. `.gitignore` s'en charge déjà.

2. **Sur Render** :
   - *New* → *Web Service*
   - Connecte le repo `jova-ai-backend`
   - **Build Command** : `npm install`
   - **Start Command** : `npm start`
   - **Environment** → *Add Environment Variable* :
     - `ANTHROPIC_API_KEY` = ta vraie clé API Anthropic (depuis console.anthropic.com)
   - Clique *Create Web Service*

3. **Récupère l'URL Render** une fois déployé, du style :
   `https://jova-ai-backend.onrender.com`

4. **Mets à jour `jova-ai.html`** (le fichier du site, pas celui-ci) :
   - Cherche la ligne `const BACKEND_URL = "..."`
   - Remplace par ton URL Render + `/api/jova-ai/chat`, par exemple :
     ```js
     const BACKEND_URL = "https://jova-ai-backend.onrender.com/api/jova-ai/chat";
     ```

5. **Republie `jova-ai.html`** sur GitHub Pages (comme d'habitude).

## Test rapide

Une fois Render déployé, ouvre l'URL du service dans Chrome — tu dois voir :
`JOVA AI backend en ligne ✅`

Si tu vois ça, le serveur tourne. Le chat sur `jova-ai.html` devrait alors fonctionner.

## Astuce

Render "endort" les services gratuits après quelques minutes d'inactivité — le premier
message après une pause peut mettre 20-30 secondes à répondre le temps que le serveur
se réveille. C'est normal, pas un bug.
# JOVA
