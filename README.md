# Multilingual Translator Web App

A browser-based translator that can run locally or be published as a static website.

## Features

- Translate between English, Chinese, Spanish, French, Japanese, Korean, German, Italian, Portuguese, Russian, Arabic, and Hindi
- English and Chinese are the default language pair
- Pronunciation for input and translated text
- Spelling correction
- Alternate translation meanings
- Simple English wording section
- Common phrase shortcuts
- Language details with detected input, text size, and reading time
- Saved translations
- Recent translation history saved on this computer
- Progressive Web App support through `manifest.webmanifest` and `sw.js`

## Run Locally

Start a static server in this folder:

```bash
python3 -m http.server 4173
```

Then open:

```text
http://127.0.0.1:4173/index.html
```

You can also double-click the local macOS launcher:

```text
English Chinese Translator.app
```

## Publish As A Webpage

This app is already a static webpage. To publish it with GitHub Pages:

1. Create a GitHub repository.
2. Upload these files and folders:
   - `index.html`
   - `style.css`
   - `main.js`
   - `manifest.webmanifest`
   - `sw.js`
   - `.launcher-assets/`
3. In GitHub, open the repository settings.
4. Go to Pages.
5. Set the source to the main branch and root folder.
6. Open the Pages URL after GitHub finishes deploying.

The translator uses public online services for translation and spelling correction, so those features need internet access.
