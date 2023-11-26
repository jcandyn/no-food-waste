document.addEventListener("DOMContentLoaded", function () {
  const welcomeMessage = document.getElementById("welcome-message");
  const typingIndicator = document.getElementById("typing-indicator");
  const messages = [
    "hello!",
    "the world is your oyster!",
    "take it one expiration at a time.",
    "the possibilities are endless.",
    "this is efficiency made easy.",
  ];

  let currentMessageIndex = 0;
  let currentCharIndex = 0;

  function typeMessage() {
    typingIndicator.textContent = "";
    if (currentCharIndex < messages[currentMessageIndex].length) {
      welcomeMessage.textContent +=
        messages[currentMessageIndex][currentCharIndex];
      typingIndicator.textContent += "|";
      currentCharIndex++;
      setTimeout(typeMessage, 100);
    } else {
      typingIndicator.textContent = "";
      setTimeout(function () {
        eraseMessage();
      }, 6000);
    }
  }

  function eraseMessage() {
    if (welcomeMessage.textContent.length > 0) {
      welcomeMessage.textContent = welcomeMessage.textContent.slice(0, -1);
      setTimeout(eraseMessage, 50);
    } else {
      currentMessageIndex = (currentMessageIndex + 1) % messages.length;
      currentCharIndex = 0;
      setTimeout(typeMessage, 500);
    }
  }

  typeMessage();
});
