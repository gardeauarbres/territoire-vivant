# 🚀 Guide de Déploiement Vercel

Ce projet Next.js est prêt à être déployé sur Vercel, la plateforme optimisée pour Next.js.

## Prérequis
- Un compte [GitHub](https://github.com/), GitLab ou Bitbucket.
- Un compte [Vercel](https://vercel.com/) (gratuit).

## Étapes

### 1. Pousser le code
Si ce n'est pas déjà fait, initialisez un dépôt git et poussez votre code :

```bash
git init
git add .
git commit -m "Initial commit - Territoire Vivant"
# Créez le repo sur GitHub puis :
git branch -M main
git remote add origin https://github.com/VOTRE_USER/territoire-vivant.git
git push -u origin main
```

### 2. Connecter Vercel
1.  Allez sur votre [Dashboard Vercel](https://vercel.com/dashboard).
2.  Cliquez sur **"Add New..."** > **"Project"**.
3.  Importez le dépôt `territoire-vivant` depuis votre fournisseur Git.

### 3. Configuration
Vercel détectera automatiquement qu'il s'agit d'un projet Next.js.
- **Framework Preset**: Next.js
- **Root Directory**: `./` (racine)
- **Environment Variables**:
    - Si vous utilisez la vraie API Gemini plus tard, ajoutez `GEMINI_API_KEY` ici.
    - Pour l'instant (simulation), aucune variable n'est requise.

### 4. Déployer
Cliquez sur **"Deploy"**.
Vercel va construire l'application (comme nous l'avons fait avec `npm run build`).
Une fois terminé, vous obtiendrez une URL (ex: `territoire-vivant.vercel.app`) accessible depuis n'importe quel mobile !

## 📱 Vérification PWA
Sur mobile, ouvrez l'URL générée.
- Android (Chrome) : Une bannière "Ajouter à l'écran d'accueil" devrait apparaître (ou via le menu).
- iOS (Safari) : Bouton "Partager" > "Sur l'écran d'accueil".

L'application se comportera alors comme une app native (plein écran, pas de barre d'URL).
