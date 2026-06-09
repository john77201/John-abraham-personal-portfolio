/**
 * Interactive portfolio terminal
 */
(function () {
  const P = typeof PROFILE !== "undefined" ? PROFILE : {};
  const host = `${P.slug || "portfolio"}-portfolio`;
  const promptUser = `guest@${(P.slug || "guest").split("-")[0]}.a`;
  const promptStr = `<span class="t-prompt-user">${promptUser}</span><span class="t-prompt-path">:~$</span>`;

  const terminalBody = document.getElementById("terminalBody");
  const terminalInput = document.getElementById("terminalInput");
  const terminalTitle = document.getElementById("terminalTitle");
  if (!terminalBody || !terminalInput) return;

  if (terminalTitle) {
    terminalTitle.textContent = `guest@${host}: ~`;
  }

  const history = [];
  let historyIndex = -1;

  const COMMANDS = {
    help: () => cmdHelp(),
    about: () => cmdAbout(),
    skills: () => cmdSkills(),
    projects: () => cmdProjects(),
    contact: () => cmdContact(),
    education: () => cmdEducation(),
    github: () => cmdOpenLink("github", "Opening GitHub profile…"),
    linkedin: () => cmdOpenLink("linkedin", "Opening LinkedIn profile…"),
    twitter: () => cmdOpenLink("twitter", "Opening Twitter/X…"),
    instagram: () => cmdOpenLink("instagram", "Opening Instagram…"),
    leetcode: () => cmdOpenLink("leetcode", "Opening LeetCode…"),
    email: () => cmdEmail(),
    resume: () => cmdResume(),
    repos: () => cmdRepos(),
    clear: () => {
      terminalBody.innerHTML = "";
      return [];
    },
    whoami: () => [
      { type: "info", text: "guest (visitor)" },
      { type: "muted", text: `Connected to ${P.fullName || P.firstName || "portfolio"}'s resume server.` },
    ],
    social: () => cmdSocial(),
  };

  function fullName() {
    return P.fullName || `${P.firstName || ""} ${P.lastName || ""}`.trim() || "Developer";
  }

  function link(key) {
    return P.links?.[key] || "";
  }

  function printLines(lines) {
    lines.forEach((line) => {
      if (typeof line === "string") appendLine(line, "text");
      else appendLine(line.text, line.type || "text", line.href);
    });
  }

  function appendLine(text, type = "text", href = null) {
    const div = document.createElement("div");
    div.className = `t-line t-${type}`;
    if (href) {
      const a = document.createElement("a");
      a.href = href;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = text;
      div.appendChild(a);
    } else {
      div.textContent = text;
    }
    terminalBody.appendChild(div);
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  function appendHtml(html) {
    const div = document.createElement("div");
    div.className = "t-line t-output";
    div.innerHTML = html;
    terminalBody.appendChild(div);
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  function appendCommandLine(cmd) {
    const div = document.createElement("div");
    div.className = "t-line t-command";
    div.innerHTML = `${promptStr} <span class="t-cmd-echo">${escapeHtml(cmd)}</span>`;
    terminalBody.appendChild(div);
  }

  function escapeHtml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function boot() {
    printLines([
      { type: "success", text: "Connection established successfully." },
      { type: "text", text: `Welcome to ${fullName()}'s Portfolio Terminal (v1.0.0-stable)` },
      { type: "muted", text: "Type help to view all available commands." },
      { type: "muted", text: "Try: github · linkedin · skills · SELECT * FROM projects;" },
    ]);
    showPrompt();
  }

  function showPrompt() {
    const row = document.createElement("div");
    row.className = "t-line t-input-row";
    row.innerHTML = `${promptStr} `;
    const input = document.createElement("span");
    input.className = "t-inline-input";
    input.contentEditable = "true";
    input.setAttribute("spellcheck", "false");
    input.setAttribute("aria-label", "Terminal command input");
    row.appendChild(input);
    terminalBody.appendChild(row);
    terminalBody.scrollTop = terminalBody.scrollHeight;

    input.focus();
    bindInput(input);
  }

  function bindInput(input) {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const cmd = input.textContent.trim();
        const row = input.closest(".t-input-row");
        if (row) {
          row.classList.remove("t-input-row");
          row.innerHTML = `${promptStr} <span class="t-cmd-echo">${escapeHtml(cmd)}</span>`;
        }
        if (cmd) {
          history.push(cmd);
          historyIndex = history.length;
          execute(cmd);
        } else {
          showPrompt();
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (history.length && historyIndex > 0) {
          historyIndex--;
          input.textContent = history[historyIndex];
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (historyIndex < history.length - 1) {
          historyIndex++;
          input.textContent = history[historyIndex];
        } else {
          historyIndex = history.length;
          input.textContent = "";
        }
      } else if (e.key === "Tab") {
        e.preventDefault();
        const partial = input.textContent.trim().toLowerCase();
        const all = [...Object.keys(COMMANDS), "select", "show"];
        const match = all.find((c) => c.startsWith(partial));
        if (match) input.textContent = match + (match.startsWith("select") ? " " : "");
      }
    });

    terminalInput.addEventListener("keydown", (e) => {
      if (["Enter", "ArrowUp", "ArrowDown", "Tab"].includes(e.key)) {
        input.focus();
        input.dispatchEvent(new KeyboardEvent("keydown", { key: e.key, bubbles: true, cancelable: true }));
        e.preventDefault();
      }
    });
  }

  // Hidden input for mobile focus
  terminalInput.addEventListener("input", () => {
    const active = terminalBody.querySelector(".t-inline-input");
    if (active) active.textContent = terminalInput.value;
  });

  terminalBody.addEventListener("click", () => {
    const active = terminalBody.querySelector(".t-inline-input");
    active?.focus();
    terminalInput.focus();
  });

  async function execute(raw) {
    const cmd = raw.trim();
    const lower = cmd.toLowerCase();

    if (!cmd) {
      showPrompt();
      return;
    }

    if (lower.startsWith("select ") || lower.startsWith("show ")) {
      handleSql(cmd);
      showPrompt();
      return;
    }

    const base = lower.split(/\s+/)[0];
    const handler = COMMANDS[base];

    if (handler) {
      const result = await handler();
      if (Array.isArray(result) && result.length) printLines(result);
      else if (result && Array.isArray(result.lines)) printLines(result.lines);
    } else {
      appendLine(`Command not found: ${cmd}. Type help for available commands.`, "error");
    }
    showPrompt();
  }

  function cmdHelp() {
    return [
      { type: "title", text: "Available commands" },
      { type: "muted", text: "─".repeat(42) },
      { type: "cmd-help", text: "help        — Show this list" },
      { type: "cmd-help", text: "about       — About me" },
      { type: "cmd-help", text: "skills      — Technical skills" },
      { type: "cmd-help", text: "projects    — Project index" },
      { type: "cmd-help", text: "education   — Academic background" },
      { type: "cmd-help", text: "contact     — Email, phone, location" },
      { type: "cmd-help", text: "github      — Open GitHub profile" },
      { type: "cmd-help", text: "linkedin    — Open LinkedIn profile" },
      { type: "cmd-help", text: "repos       — Fetch latest GitHub repos" },
      { type: "cmd-help", text: "social      — All social links" },
      { type: "cmd-help", text: "email       — Send email" },
      { type: "cmd-help", text: "resume      — Download resume" },
      { type: "cmd-help", text: "whoami      — Current session user" },
      { type: "cmd-help", text: "clear       — Clear terminal" },
      { type: "muted", text: "─".repeat(42) },
      { type: "cmd-help", text: "SQL: SHOW TABLES;" },
      { type: "cmd-help", text: "     SELECT * FROM skills;" },
      { type: "cmd-help", text: "     SELECT * FROM projects;" },
      { type: "cmd-help", text: "     SELECT * FROM education;" },
    ];
  }

  function cmdAbout() {
    return [
      { type: "title", text: fullName() },
      { type: "accent", text: P.title || "BCA Graduate" },
      { type: "text", text: P.about || "" },
    ];
  }

  function cmdSkills() {
    const skills = P.skills || [];
    const rows = skills.map(
      (s) => `  ${String(s.name).padEnd(16)} ${s.category?.padEnd(10) || ""} ${s.level}%`
    );
    return [
      { type: "title", text: "Skills profile" },
      ...rows.map((r) => ({ type: "mono", text: r })),
      { type: "muted", text: `\n${skills.length} rows returned. Try: SELECT * FROM skills;` },
    ];
  }

  function cmdProjects() {
    const projects = P.projects || [];
    return projects.flatMap((p, i) => [
      { type: "accent", text: `[${p.id ?? i + 1}] ${p.name}` },
      { type: "muted", text: `    ${p.type}` },
      { type: "text", text: `    ${p.description}` },
      { type: "mono", text: `    stack: ${p.stack}` },
      ...(p.repo && p.repo !== "#"
        ? [{ type: "link", text: `    repo: ${p.repo}`, href: p.repo }]
        : []),
    ]);
  }

  function cmdContact() {
    const lines = [
      { type: "title", text: "Contact" },
      { type: "text", text: `Email:    ${P.email || "—"}` },
      { type: "text", text: `Phone:    ${P.phone || "—"}` },
      { type: "text", text: `Location: ${P.location || "—"}` },
    ];
    if (link("github"))
      lines.push({ type: "link", text: `GitHub:   ${link("github")}`, href: link("github") });
    if (link("linkedin"))
      lines.push({ type: "link", text: `LinkedIn: ${link("linkedin")}`, href: link("linkedin") });
    return lines;
  }

  function cmdEducation() {
    const lines = [{ type: "title", text: "Education" }];
    if (P.education && P.education.length) {
      P.education.forEach((edu) => {
        lines.push({ type: "accent", text: edu.degree });
        lines.push({ type: "text", text: `${edu.institution} (${edu.years})` });
        if (edu.details) {
          lines.push({ type: "muted", text: `  ${edu.details}` });
        }
      });
    } else {
      lines.push({ type: "accent", text: P.degree || "BCA" });
      lines.push({ type: "text", text: `${P.college || "—"} (${P.educationYears || "—"})` });
    }
    return lines;
  }

  function cmdOpenLink(key, msg) {
    const url = link(key);
    if (!url) {
      return [{ type: "error", text: `${key} link not configured. Edit config.js → links.${key}` }];
    }
    window.open(url, "_blank", "noopener,noreferrer");
    return [
      { type: "success", text: msg },
      { type: "link", text: url, href: url },
    ];
  }

  function cmdEmail() {
    if (!P.email) return [{ type: "error", text: "Email not set in config.js" }];
    const displayName = `${P.firstName || ""} ${P.lastName || ""}`.trim();
    const mailtoRecipient = displayName
      ? `${encodeURIComponent(displayName)}%20%3C${P.email}%3E`
      : P.email;
    window.location.href = `mailto:${mailtoRecipient}`;
    return [{ type: "success", text: `Opening mail client for ${P.email}…` }];
  }

  function cmdResume() {
    const url = P.resumeUrl;
    if (!url || url === "#") {
      return [{ type: "warning", text: "Add resumeUrl in config.js (link to your PDF)." }];
    }
    window.open(url, "_blank");
    return [{ type: "success", text: "Opening resume…" }];
  }

  function cmdSocial() {
    const keys = ["github", "linkedin", "twitter", "instagram", "leetcode", "hackerrank"];
    const lines = [{ type: "title", text: "Social links" }];
    let count = 0;
    keys.forEach((k) => {
      const url = link(k);
      if (url) {
        count++;
        lines.push({ type: "link", text: `${k.padEnd(12)} ${url}`, href: url });
      }
    });
    if (!count) lines.push({ type: "warning", text: "No links set. Edit config.js → links { }" });
    return lines;
  }

  async function cmdRepos() {
    const user = P.githubUsername;
    if (!user || user.includes("YOUR")) {
      return [{ type: "error", text: "Set githubUsername in config.js" }];
    }
    appendLine("Fetching repositories from GitHub API…", "muted");
    try {
      const res = await fetch(`https://api.github.com/users/${encodeURIComponent(user)}/repos?sort=updated&per_page=6`);
      if (!res.ok) throw new Error(res.statusText);
      const repos = await res.json();
      const lines = [
        { type: "title", text: `GitHub: @${user}` },
        ...repos.map((r) => ({
          type: "link",
          text: `  ★ ${r.stargazers_count}  ${r.name} — ${r.description || "No description"}`,
          href: r.html_url,
        })),
      ];
      printLines(lines);
    } catch (e) {
      printLines([
        { type: "error", text: `Could not fetch repos: ${e.message}` },
        { type: "muted", text: "Open profile manually: type github" },
      ]);
    }
    return [];
  }

  function handleSql(query) {
    const q = query.trim().toLowerCase().replace(/;/g, "");

    if (q === "show tables") {
      appendHtml(
        `<pre class="t-table">+------------------+
| Tables_in_resume |
+------------------+
| skills           |
| projects         |
| education        |
| contact          |
+------------------+</pre>`
      );
      return;
    }

    const selectMatch = q.match(/^select \* from (\w+)/);
    if (selectMatch) {
      const table = selectMatch[1];
      switch (table) {
        case "skills":
          renderTable(
            ["id", "name", "category", "level"],
            (P.skills || []).map((s, i) => [i + 1, s.name, s.category, s.level])
          );
          break;
        case "projects":
          renderTable(
            ["id", "name", "stack", "type"],
            (P.projects || []).map((p) => [p.id, p.name, p.stack, p.type])
          );
          break;
        case "education":
          if (P.education && P.education.length) {
            renderTable(
              ["degree", "institution", "years"],
              P.education.map((edu) => [edu.degree, edu.institution, edu.years])
            );
          } else {
            renderTable(
              ["degree", "institution", "years", "grade"],
              [[P.degree, P.college, P.educationYears, P.cgpa]]
            );
          }
          break;
        case "contact":
          renderTable(
            ["type", "value"],
            [
              ["email", P.email],
              ["phone", P.phone],
              ["github", link("github")],
              ["linkedin", link("linkedin")],
            ]
          );
          break;
        default:
          appendLine(`Table '${table}' doesn't exist. Try SHOW TABLES;`, "error");
      }
      return;
    }

    appendLine("SQL syntax: SHOW TABLES; or SELECT * FROM skills;", "error");
  }

  function renderTable(headers, rows) {
    const colWidths = headers.map((h, i) =>
      Math.max(h.length, ...rows.map((r) => String(r[i] ?? "").length))
    );
    const sep = "+" + colWidths.map((w) => "-".repeat(w + 2)).join("+") + "+";
    const fmtRow = (cells) =>
      "|" +
      cells.map((c, i) => ` ${String(c ?? "").padEnd(colWidths[i])} `).join("|") +
      "|";

    let out = sep + "\n" + fmtRow(headers) + "\n" + sep + "\n";
    rows.forEach((r) => {
      out += fmtRow(r) + "\n";
    });
    out += sep + `\n${rows.length} row(s) in set`;
    appendHtml(`<pre class="t-table">${escapeHtml(out)}</pre>`);
  }

  boot();

  // Expose for external "Try command" buttons
  window.portfolioTerminal = { execute: (cmd) => { appendCommandLine(cmd); execute(cmd); } };
})();
