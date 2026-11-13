# FORGOTTEN WORLD STUDIO — Starter 0.1

A free, static, browser-based film-planning workspace.

## What works now
- Create, edit and delete scenes.
- Track scene duration and production status.
- Upload character reference images (up to 5 MB each).
- Store approved character design notes.
- Build reusable cinematic video prompts.
- Save the project in the current browser's local storage.
- Export and import a project JSON backup.

## What is not implemented yet
This starter does not generate AI images or videos, record voices, mix audio, or render MP4 files yet. Those need separate model/runtime integrations. A free static website host does not provide unlimited AI video compute.

## Run locally
You can simply open `index.html` in a modern browser. For best results, run a local static server:

```bash
python -m http.server 8000
```

Then open http://localhost:8000

## Deploy free with GitHub Pages
1. Create a GitHub account and a new public repository named `forgotten-world-studio`.
2. Upload `index.html`, `style.css`, `app.js`, and `README.md` to the repository root.
3. Open repository **Settings → Pages**.
4. Under Build and deployment, choose **Deploy from a branch**.
5. Choose `main` and `/ (root)`, then Save.
6. Wait for GitHub Pages to publish the site. Your website address will be shown in Settings → Pages.

## Important storage note
This first version stores project data in the browser on the device where it is used. It does not yet sync projects between devices or provide cloud accounts. Export JSON backups regularly. Character images are embedded in the project data and can make the export file large.

## Next development milestones
1. Timeline with video, image, narration and music tracks.
2. Browser-based preview and editing.
3. Optional FFmpeg rendering pipeline.
4. Image-generation and video-generation provider adapters.
5. Secure backend for accounts and cloud storage, if needed.
