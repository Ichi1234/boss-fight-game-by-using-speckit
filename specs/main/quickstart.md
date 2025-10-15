# quickstart.md

Quick local run (Windows PowerShell)

1) Serve the `src` folder with Python (quick) and open the game in a browser:

```powershell
cd C:\Coding_Ichi\boss-fight-game-by-using-speckit\src
python -m http.server 3000
# Open http://localhost:3000 in your browser
```

2) Or use npx http-server from the repo root:

```powershell
cd C:\Coding_Ichi\boss-fight-game-by-using-speckit
npx http-server .\src -p 3000
# Open http://localhost:3000
```

3) If you prefer to run from repo root and serve all assets (recommended when `img/` is at repo root):

```powershell
cd C:\Coding_Ichi\boss-fight-game-by-using-speckit
python -m http.server 3000
# Open http://localhost:3000/src/index.html
```

Notes
- The project uses Phaser via CDN in `src/index.html`, so no npm install is required for running the game in the browser via static server.
- To develop with auto-reload, add a simple dev server (e.g., `lite-server` or `webpack-dev-server`) and an npm script.
