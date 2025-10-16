## Configuration de la base de tests sur Supabase

1. **Créer le projet Supabase**
   - Rendez-vous sur `https://app.supabase.com`, créez un projet et récupérez l’URL du projet ainsi que le mot de passe de la base (menu `Settings → Database → Connection string → Password`).
   - Facultatif : exécutez `CREATE SCHEMA school_management;` dans le SQL Editor si vous souhaitez isoler les tables.

2. **Définir la chaîne de connexion**
   - Dans `Connection string → Node.js`, copiez l’URL de service (ex. `postgresql://postgres:<PASSWORD>@db.xyz.supabase.co:5432/postgres?sslmode=require`).
   - Créez ou mettez à jour `.env.test` :
     ```env
     NODE_ENV=test
     DATABASE_URL=postgresql://postgres:<PASSWORD>@db.xyz.supabase.co:5432/postgres?sslmode=require
     JWT_SECRET=<clé-test>
     ```

3. **Ajuster la configuration Jest**
   - Dans `tests/setup.js`, remplacez la ligne qui force `DB_TYPE=sqlite` par `process.env.DB_TYPE = 'postgres';`.
   - Supprimez toute référence à `SQLITE_PATH`. La présence de `DATABASE_URL` suffit pour `config/sequelize.js`.

4. **Provisionner la base Supabase**
   - Depuis la racine du backend, appliquez les migrations :
     ```bash
     npx sequelize-cli db:migrate --env test
     ```
   - Facultatif : exécutez les seeds si les tests nécessitent des données :
     ```bash
     npx sequelize-cli db:seed:all --env test
     ```

5. **Lancer les tests Jest**
   - Exécutez `npm run test`.
   - Pour éviter de détruire le schéma, remplacez éventuellement `sequelize.sync({ force: true })` par `sequelize.truncate({ cascade: true })` dans `tests/setup.js`.

6. **Bonnes pratiques Supabase**
   - Limitez le pool de connexions dans `config/sequelize.js` si nécessaire (`pool: { max: 5 }`).
   - Conservez les identifiants “service role” secrets et dédiés aux tests.
   - Pour réinitialiser, utilisez le bouton “Reset database” ou exécutez `DROP SCHEMA school_management CASCADE` puis recréez-le.

> Après ces étapes, la suite Jest s’exécutera contre Supabase, débloquant les tests SchoolYear et ClassRoom/ClassGroup.
