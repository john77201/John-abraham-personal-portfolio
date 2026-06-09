/**
 * Portfolio Chatbot — John's AI Helper
 */
const BOT_RESPONSES = {
  greeting: "I can show you around my portfolio. Ask me anything, or try these actions:<br><br>👉 <a href='#' class='bot-nav-link' data-target='skills'>Go to Skills</a><br>💻 <a href='#' class='bot-cmd-link' data-cmd='SELECT * FROM skills;'>Query Skills via SQL</a>",
  skills: "John is skilled in **Java, Python, JavaScript, HTML/CSS, MySQL**, and **Git & GitHub**.<br><br>💡 *Interactive Actions:*<br>👉 <a href='#' class='bot-nav-link' data-target='skills'>Scroll to Skills Section</a><br>💻 <a href='#' class='bot-cmd-link' data-cmd='SELECT * FROM skills;'>Run SQL query on Skills</a>",
  education: "John is currently pursuing a **Bachelor of Computer Applications (BCA)** affiliated to Mahatma Gandhi University, Kottayam (2022 — 2026). Prior to this, he completed his Higher Secondary (+2) in Kerala Board (2021 — 2023) and SSLC in Kerala Board (2021).<br><br>💡 *Interactive Actions:*<br>👉 <a href='#' class='bot-nav-link' data-target='education'>Scroll to Education Timeline</a><br>💻 <a href='#' class='bot-cmd-link' data-cmd='SELECT * FROM education;'>Run SQL query on Education</a>",
  contact: "You can contact John via:<br>✉️ Email: **johnabraham4835@gmail.com**<br>📱 Phone: **+91 62823 86042**<br>📍 Location: **Idukki, Kerala, India**<br><br>💡 *Interactive Actions:*<br>👉 <a href='#' class='bot-nav-link' data-target='contact'>Scroll to Contact Card</a>",
  projects: "John has built several projects:<br>1. **Aroma Hub** (E-commerce site in PHP/MySQL)<br>2. **Tribal Village Tourism** (Python/Flask booking site)<br>3. **Nazario Premium Tours** (Travel enquiry site)<br>4. **Portfolio Website** (HTML/CSS/JS)<br><br>💡 *Interactive Actions:*<br>👉 <a href='#' class='bot-nav-link' data-target='projects'>Scroll to Projects Gallery</a><br>💻 <a href='#' class='bot-cmd-link' data-cmd='SELECT * FROM projects;'>Run SQL query on Projects</a>",
  aroma: "**Aroma Hub** is a Web E-Commerce project built using **PHP, MySQL, HTML, CSS, JavaScript, and AJAX**. It simplifies the process of purchasing high-quality spices online.<br><br>👉 <a href='#' class='bot-nav-link' data-target='projects'>View Aroma Hub Details</a>",
  tribal: "**Tribal Village Tourism** is a Web Tourism project built using **Python and Flask**. It promotes sustainable village tourism and includes online booking services.<br><br>👉 <a href='#' class='bot-nav-link' data-target='projects'>View Tribal Village Details</a>",
  nazario: "**Nazario Premium Tours** is a frontend travel enquiry website built using **HTML, CSS, and JavaScript**.<br><br>👉 <a href='#' class='bot-nav-link' data-target='projects'>View Nazario Tours Details</a>",
  portfolio: "This **Portfolio Website** is built using **HTML, CSS, and vanilla JavaScript**, showcasing his skills, terminal experience, and completed projects.",
  languages: "John speaks the following languages:<br>🗣️ **Malayalam**: Highly Known (Native, 100%)<br>🗣️ **English**: Highly Known (Fluent, 90%)<br>🗣️ **Hindi**: 65% Known (Conversational)<br>🗣️ **Tamil**: 55% Known (Conversational)<br><br>👉 <a href='#' class='bot-nav-link' data-target='skills'>Go to Spoken Languages Section</a>",
  default: "I'm not sure about that. Try asking about 'skills', 'languages', 'education', 'projects', or 'contact'!"
};

function getBotResponse(userMsg) {
  const msg = userMsg.toLowerCase().trim();
  
  if (msg.includes("hi") || msg.includes("hello") || msg.includes("hey") || msg.includes("greet")) {
    return BOT_RESPONSES.greeting;
  }
  if (msg.includes("speak") || msg.includes("talk") || msg.includes("malayalam") || msg.includes("tamil") || msg.includes("hindi") || msg.includes("spoken") || (msg.includes("language") && !msg.includes("programming") && !msg.includes("coding") && !msg.includes("computer"))) {
    return BOT_RESPONSES.languages;
  }
  if (msg.includes("skill") || msg.includes("tech") || msg.includes("language") || msg.includes("know")) {
    return BOT_RESPONSES.skills;
  }
  if (msg.includes("educat") || msg.includes("college") || msg.includes("university") || msg.includes("degree") || msg.includes("school") || msg.includes("bca") || msg.includes("sslc") || msg.includes("+2")) {
    return BOT_RESPONSES.education;
  }
  if (msg.includes("contact") || msg.includes("email") || msg.includes("phone") || msg.includes("number") || msg.includes("mail") || msg.includes("location") || msg.includes("address") || msg.includes("idukki")) {
    return BOT_RESPONSES.contact;
  }
  if (msg.includes("aroma") || msg.includes("spice")) {
    return BOT_RESPONSES.aroma;
  }
  if (msg.includes("tribal") || msg.includes("tourism") || msg.includes("village")) {
    return BOT_RESPONSES.tribal;
  }
  if (msg.includes("nazario") || msg.includes("tour") || msg.includes("travel")) {
    return BOT_RESPONSES.nazario;
  }
  if (msg.includes("portfolio")) {
    return BOT_RESPONSES.portfolio;
  }
  if (msg.includes("project") || msg.includes("work") || msg.includes("code")) {
    return BOT_RESPONSES.projects;
  }
  
  return BOT_RESPONSES.default;
}

document.addEventListener("DOMContentLoaded", () => {
  const widget = document.getElementById("chatbotWidget");
  const trigger = document.getElementById("chatbotTrigger");
  const windowEl = document.getElementById("chatbotWindow");
  const closeBtn = document.getElementById("chatbotCloseBtn");
  const body = document.getElementById("chatbotBody");
  const form = document.getElementById("chatbotInputArea");
  const input = document.getElementById("chatbotInput");
  const suggestions = document.getElementById("chatbotSuggestions");

  if (!widget || !trigger || !windowEl || !closeBtn || !body || !form || !input) return;

  let hasGreeted = false;

  // Toggle open
  trigger.addEventListener("click", () => {
    const isOpen = widget.classList.toggle("open");
    if (isOpen && !hasGreeted) {
      showTypingIndicator();
      setTimeout(() => {
        removeTypingIndicator();
        
        // Time-aware greeting
        const hour = new Date().getHours();
        let timeWord = "day";
        if (hour < 12) timeWord = "morning";
        else if (hour < 18) timeWord = "afternoon";
        else timeWord = "evening";
        
        const fullGreeting = `Good ${timeWord}! I'm John's AI assistant. ${BOT_RESPONSES.greeting}`;
        showBotMessage(fullGreeting);
        hasGreeted = true;
      }, 800);
    }
  });

  closeBtn.addEventListener("click", () => {
    widget.classList.remove("open");
  });

  // Suggestion chips
  suggestions.addEventListener("click", (e) => {
    const chip = e.target.closest(".suggestion-chip");
    if (!chip) return;
    const query = chip.dataset.query;
    const text = chip.textContent;
    handleUserQuery(text, query);
  });

  // Form submit
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const queryText = input.value.trim();
    if (!queryText) return;
    input.value = "";
    handleUserQuery(queryText);
  });

  // Deep Integration Event Listeners for Chat Message Body Links
  body.addEventListener("click", (e) => {
    // 1. Navigation / Scroll links
    const navLink = e.target.closest(".bot-nav-link");
    if (navLink) {
      e.preventDefault();
      const targetId = navLink.dataset.target;
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        if (window.innerWidth <= 480) {
          widget.classList.remove("open");
        }
      }
      return;
    }

    // 2. Terminal Commands links
    const cmdLink = e.target.closest(".bot-cmd-link");
    if (cmdLink) {
      e.preventDefault();
      const cmd = cmdLink.dataset.cmd;
      const termEl = document.getElementById("terminal");
      if (termEl && window.portfolioTerminal) {
        termEl.scrollIntoView({ behavior: "smooth" });
        setTimeout(() => {
          window.portfolioTerminal.execute(cmd);
        }, 500);
        if (window.innerWidth <= 480) {
          widget.classList.remove("open");
        }
      }
      return;
    }
  });

  function handleUserQuery(text, key = null) {
    showUserMessage(text);
    showTypingIndicator();

    setTimeout(() => {
      removeTypingIndicator();
      let response = "";
      if (key && BOT_RESPONSES[key]) {
        response = BOT_RESPONSES[key];
      } else {
        response = getBotResponse(text);
      }
      showBotMessage(response);
    }, 1000);
  }

  function showUserMessage(text) {
    const div = document.createElement("div");
    div.className = "chat-msg user";
    div.textContent = text;
    body.appendChild(div);
    scrollToBottom();
  }

  function showBotMessage(html) {
    const div = document.createElement("div");
    div.className = "chat-msg bot";
    let formatted = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    div.innerHTML = formatted;
    body.appendChild(div);
    scrollToBottom();
  }

  function showTypingIndicator() {
    const div = document.createElement("div");
    div.className = "typing-indicator";
    div.id = "chatbotTypingIndicator";
    div.innerHTML = `
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
    `;
    body.appendChild(div);
    scrollToBottom();
  }

  function removeTypingIndicator() {
    const el = document.getElementById("chatbotTypingIndicator");
    if (el) el.remove();
  }

  function scrollToBottom() {
    body.scrollTop = body.scrollHeight;
  }
});
