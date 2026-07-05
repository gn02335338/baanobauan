# บ้านอบอวล | Baan Ob Auan

Static promotional and online-order page for บ้านอบอวล | Baan Ob Auan.

## Deploy To Zeabur From GitHub

1. Create a new GitHub repository.
2. Put this folder's files at the repository root, so `index.html` is directly in the root.
3. Commit and push:

   ```powershell
   git init
   git add .
   git commit -m "Initial Baan Ob Auan website"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

4. In Zeabur, create a project, create a service from GitHub, and select this repository.
5. Zeabur should detect it as a static site because the root contains `index.html`.
6. After deployment, open the service's Domains tab and generate a domain or bind a custom domain.

## Edit Products

Products, prices, and translations are in `app.js`. Images are in `assets/`.
