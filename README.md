# DEVIS·BASE — Dashboard Admin

Tableau de bord super-administrateur. Accès restreint.

## Déploiement sur Vercel (projet séparé)

1. Créez un **nouveau projet** sur Vercel
2. Uploadez ce dossier comme repo GitHub séparé : `devis-base-admin`
3. Vercel détecte automatiquement Vite
4. L'URL sera : `devis-base-admin.vercel.app`

## Fonctionnalités

- **Vue d'ensemble** : MRR, ARR, organisations, utilisateurs, postes
- **Organisations** : liste complète, changement de plan, suspension
- **Utilisateurs** : tous les membres de toutes les orgs
- **Activité** : logs des actions (imports, exports, etc.)
- **Revenus** : MRR par plan, répartition

## Sécurité

- Accès uniquement avec l'email `aurelien.vaurs@gmail.com`
- Authentification via Supabase Auth
- Token stocké en localStorage (session persistante)
- Page indexée `noindex` pour les moteurs de recherche
