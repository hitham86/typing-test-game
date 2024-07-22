// Reference to HTML elements
const displayText = document.querySelector(".display-text"),
      typingInput = document.querySelector(".typing-input"),
      restartBtn = document.querySelector(".restart-btn"),
      timeTag = document.getElementById("time"),
      mistakeTag = document.getElementById("mistakes"),
      wpmTag = document.getElementById("wpm"),
      cpmTag = document.getElementById("cpm");

let timer, 
    maxTime = 60, 
    timeLeft = maxTime, 
    charIndex = mistakes = isTyping = 0;

// Load a random paragraph into the typing box
function loadParagraph() {
  const randomIndex = Math.floor(Math.random() * paragraphs.length);
  displayText.innerHTML = ""; // Clear any previous content
  paragraphs[randomIndex].split("").forEach(char => {
    const span = document.createElement('span');
    span.textContent = char;
    displayText.appendChild(span);
  });
  displayText.querySelectorAll("span")[0].classList.add("active");
  document.addEventListener("keydown", () => typingInput.focus());
  displayText.addEventListener("click", () => typingInput.focus());
}

// Start typing test and track input
function startTyping() {
  const characters = displayText.querySelectorAll("span");
  const typedChar = typingInput.value.split("")[charIndex];

  if (charIndex < characters.length && timeLeft > 0) {
    if (!isTyping) {
      timer = setInterval(countdown, 1000);
      isTyping = true;
    }

    if (typedChar == null) {
      if (charIndex > 0) {
        charIndex--;
        if (characters[charIndex].classList.contains("incorrect")) {
          mistakes--;
        }
        characters[charIndex].classList.remove("correct", "incorrect");
      }
    } else {
      if (characters[charIndex].textContent === typedChar) {
        characters[charIndex].classList.add("correct");
      } else {
        mistakes++;
        characters[charIndex].classList.add("incorrect");
      }
      charIndex++;
    }

    characters.forEach(span => span.classList.remove("active"));
    if (charIndex < characters.length) {
      characters[charIndex].classList.add("active");
    }

    const wpm = Math.round(((charIndex - mistakes) / 5) / (maxTime - timeLeft) * 60);
    wpmTag.textContent = wpm > 0 && wpm !== Infinity ? wpm : 0;
    mistakeTag.textContent = mistakes;
    cpmTag.textContent = charIndex - mistakes;
  } else {
    clearInterval(timer);
    typingInput.value = "";
  }
}

// Countdown timer for the typing test
function countdown() {
  if (timeLeft > 0) {
    timeLeft--;
    timeTag.textContent = timeLeft;
    const wpm = Math.round(((charIndex - mistakes) / 5) / (maxTime - timeLeft) * 60);
    wpmTag.textContent = wpm > 0 && wpm !== Infinity ? wpm : 0;
  } else {
    clearInterval(timer);
  }
}

// Reset the game
function resetGame() {
  loadParagraph();
  clearInterval(timer);
  timeLeft = maxTime;
  charIndex = mistakes = isTyping = 0;
  typingInput.value = "";
  timeTag.textContent = timeLeft;
  wpmTag.textContent = 0;
  mistakeTag.textContent = 0;
  cpmTag.textContent = 0;
}

// Prevent pasting and Ctrl+V in the typing input field
typingInput.addEventListener("paste", (e) => {
  e.preventDefault(); // Stop the paste action
});
typingInput.addEventListener("keydown", (e) => {
  if (e.ctrlKey && (e.key === 'v' || e.key === 'V')) {
    e.preventDefault(); // Stop Ctrl+V
  }
});

// Initialize the game
window.onload = loadParagraph;
typingInput.addEventListener("input", startTyping);
restartBtn.addEventListener("click", resetGame);
