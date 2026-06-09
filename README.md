# BCA Graduate Portfolio Website

A professional, dark-themed portfolio with gradient accents, smooth animations, and a mobile-responsive layout — built with HTML, CSS, and JavaScript (no build step required).

## Quick start

1. Open `index.html` in your browser (double-click or drag into Chrome/Edge/Firefox).
2. Or use a local server for best results:
   - VS Code: **Live Server** extension → Right-click `index.html` → Open with Live Server
   - Python: `python -m http.server 8080` then visit `http://localhost:8080`

## Customize (checklist)

**Edit `config.js` once** — it powers the site, terminal, and social links.

| What to change | Where in `config.js` |
|----------------|----------------------|
| Name | `firstName`, `lastName` |
| GitHub | `links.github` + `githubUsername` (for `repos` command) |
| LinkedIn | `links.linkedin` |
| Twitter, Instagram, LeetCode | `links.*` (leave `""` to hide) |
| Email, phone, location | `email`, `phone`, `location` |
| College, CGPA | `college`, `cgpa`, `educationYears` |
| Skills & projects (terminal SQL) | `skills`, `projects` arrays |
| Resume PDF | `resumeUrl` |
| Photo | `index.html` — `.profile-img` `src` |

### Interactive terminal commands

| Command | Action |
|---------|--------|
| `help` | List all commands |
| `github` / `linkedin` | Opens your profiles |
| `repos` | Fetches latest public GitHub repos |
| `skills` / `projects` / `contact` | Text output |
| `SHOW TABLES;` | Lists mock resume tables |
| `SELECT * FROM skills;` | SQL-style table output |
| `clear` | Clear terminal |

Quick chips under the terminal run the same commands.

## Deploy for free

- **GitHub Pages**: Push folder to a repo → Settings → Pages → source `main` / root or `/portfolio`
- **Netlify**: Drag the `portfolio` folder to [netlify.com/drop](https://app.netlify.com/drop)
- **Vercel**: Import repo and set root to `portfolio`

## Optional upgrades

- Replace placeholder images with your project screenshots
- Add [Formspree](https://formspree.io) for contact form without mailto
- Add a `favicon.ico` and update `<title>` / meta description for SEO
- Connect Google Analytics or Plausible for visit stats

## File structure

```
portfolio/
├── config.js     # YOUR links, name, skills, projects
├── index.html    # All sections + terminal UI
├── terminal.js   # Interactive terminal logic
├── styles.css    # Design & responsive layout
├── script.js     # Animations, applies config
└── README.md     # This guide
```

Built for BCA graduates — showcase your degree, projects, and skills to recruiters and clients.
