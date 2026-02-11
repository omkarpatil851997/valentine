/* =========================
   MUSIC CONTROL SYSTEM
========================= */

function startMusic() {
  const music = document.getElementById("bg-music");
  if (!music) return;

  const shouldContinue = sessionStorage.getItem("continueMusic");
  const savedTime = sessionStorage.getItem("musicTime");

  if (shouldContinue === "true" && savedTime) {
    music.currentTime = parseFloat(savedTime);
  } else {
    music.currentTime = 0;
  }

  music.volume = 0.6;
  music.play().catch(() => {});

  sessionStorage.removeItem("continueMusic");
}

function saveMusicTime(shouldContinue = false) {
  const music = document.getElementById("bg-music");
  if (!music) return;

  sessionStorage.setItem("musicTime", music.currentTime);

  if (shouldContinue) {
    sessionStorage.setItem("continueMusic", "true");
  }
}

/* =========================
   START MUSIC ON LOAD
========================= */

window.addEventListener("load", () => {
  startMusic();
});

/* =========================
   NAVIGATION
========================= */

document.querySelector('.yes')?.addEventListener('click', () => {
  window.location.href = "Ask.html";
});

document.querySelector('.no')?.addEventListener('click', () => {
  window.location.href = "No.html";
});

/* Ask Page → Final Page */
document.querySelector('.finalyes')?.addEventListener('click', () => {
  saveMusicTime(true);   // ONLY here allow continuation
  window.location.href = "Final.html";
});

/* =========================
   MOBILE-PROOF DODGE + SHRINK + BUBBLE
========================= */

const noBtn = document.querySelector('.btn.finalno');

if (noBtn) {

  let scale = 1;
  const minScale = 0.4;
  const shrinkStep = 0.08;
  let dodgeCount = 0;
  let bubble = null;

  const card = document.querySelector('.card');

  function updateBubblePosition() {
    if (!bubble) return;

    const btnRect = noBtn.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();

    const left = btnRect.left - cardRect.left + btnRect.width / 2 - bubble.offsetWidth / 2;
    const top = btnRect.top - cardRect.top - bubble.offsetHeight - 10;

    bubble.style.left = left + "px";
    bubble.style.top = top + "px";
  }

  function showSpeechBubble() {
    if (bubble) return;

    bubble = document.createElement("div");
    bubble.className = "speech-bubble";
    bubble.textContent = "Pillu😘, please asa karu nako na...🥹😭";

    card.appendChild(bubble);

    // ensure layout calculated
    requestAnimationFrame(updateBubblePosition);
  }

  function dodgeButton(e) {
    e.preventDefault();

    dodgeCount++;

    const cardRect = card.getBoundingClientRect();
    const maxX = cardRect.width / 3;
    const maxY = cardRect.height / 4;

    const x = Math.random() * maxX - maxX / 2;
    const y = Math.random() * maxY - maxY / 2;

    if (scale > minScale) {
      scale -= shrinkStep;
    }

    noBtn.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;

    // Trigger bubble when minimum scale reached OR enough dodges
    if (scale <= minScale || dodgeCount >= 6) {
      showSpeechBubble();
    }

    requestAnimationFrame(updateBubblePosition);
  }

  // Desktop
  noBtn.addEventListener('pointerenter', dodgeButton);

  // Mobile
  noBtn.addEventListener('pointerdown', dodgeButton);
  noBtn.addEventListener('pointermove', dodgeButton);

  noBtn.addEventListener('click', (e) => e.preventDefault());

  window.addEventListener('resize', updateBubblePosition);
}

/* =========================
   HEART RAIN (ASK PAGE)
========================= */

const heartContainer = document.querySelector('.hearts');

if (heartContainer) {
  setInterval(() => {
    const heart = document.createElement('div');
    heart.classList.add('heart');
    heart.innerHTML = '💖';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = Math.random() * 3 + 3 + 's';

    heartContainer.appendChild(heart);
    setTimeout(() => heart.remove(), 6000);
  }, 300);
}

/* =========================
   BLOOMING ROSES (FINAL PAGE)
========================= */

const bloomContainer = document.querySelector(".bloom-container");

if (bloomContainer) {
  const symbols = ["🌹", "💍"];

  setInterval(() => {
    const bloom = document.createElement("div");
    bloom.classList.add("bloom");

    bloom.innerHTML = symbols[Math.floor(Math.random() * symbols.length)];
    bloom.style.left = Math.random() * 90 + "vw";
    bloom.style.top = Math.random() * 85 + "vh";

    bloomContainer.appendChild(bloom);
    setTimeout(() => bloom.remove(), 3500);
  }, 500);
}

/* =========================
   PAGE PROGRESS CONTROL
========================= */

window.addEventListener("load", () => {
  const progress = document.querySelector(".progress-fill");
  if (!progress) return;

  const percent = document.body.dataset.progress;

  if (!percent) return;

  setTimeout(() => {
    progress.style.width = percent + "%";
  }, 300);
});

/* =========================
   FINAL PAGE CAROUSEL
========================= */

const bigHeart = document.querySelector(".big-heart");

if (bigHeart) {

  bigHeart.addEventListener("click", () => {

    const card = document.querySelector(".card");

    // Remove old content
    document.querySelector(".main-text")?.remove();
    document.querySelector(".big-heart")?.remove();
    document.querySelector(".sub-text")?.remove();
    document.querySelector(".promise-text")?.remove();

    // Create carousel container
    const carousel = document.createElement("div");
    carousel.className = "carousel";

    carousel.innerHTML = `
      <div class="carousel-track">
        ${Array.from({length:11}, (_,i) => 
          `<img src="images/img${i+1}.jpeg" class="carousel-image" />`
        ).join("")}
      </div>
      <button class="carousel-btn prev">&#10094;</button>
      <button class="carousel-btn next">&#10095;</button>
    `;

    const progressWrapper = document.querySelector(".progress-wrapper");

    card.insertBefore(carousel, progressWrapper);

    // Add Romantic Message Below Carousel
    const loveNote = document.createElement("div");
    loveNote.className = "love-note";
    loveNote.innerHTML = `<p class="typing-text"></p>`;

    card.insertBefore(loveNote, progressWrapper);

    startTyping();

    initializeCarousel();
  });
}

function initializeCarousel() {

  const track = document.querySelector(".carousel-track");
  const images = document.querySelectorAll(".carousel-image");
  const prevBtn = document.querySelector(".carousel-btn.prev");
  const nextBtn = document.querySelector(".carousel-btn.next");

  let index = 0;
  let autoSlideInterval;

  function moveToSlide(i) {
    index = i;
    track.style.transform = `translateX(-${index * 100}%)`;
  }

  function nextSlide() {
    index = (index + 1) % images.length;
    moveToSlide(index);
  }

  function prevSlide() {
    index = (index - 1 + images.length) % images.length;
    moveToSlide(index);
  }

  nextBtn.addEventListener("click", () => {
    nextSlide();
    resetAutoSlide();
  });

  prevBtn.addEventListener("click", () => {
    prevSlide();
    resetAutoSlide();
  });

  /* -------- AUTO SLIDE -------- */

  function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
      nextSlide();
    }, 5000); // 5 seconds
  }

  function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
  }

  startAutoSlide();

  /* -------- MOBILE SWIPE -------- */

  let startX = 0;

  track.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
  });

  track.addEventListener("touchend", e => {
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;

    if (diff > 50) nextSlide();
    if (diff < -50) prevSlide();

    resetAutoSlide();
  });
}

function startTyping() {

  const lines = [
    "Trupti ... maza baal😘, pillu😘, janemaan😘… tu mazi aaj aahes, udya aahes, ani kaayam majhich rahashil. Mi tujhya premat fakta padlo nahi… mi tyat sampurn haravun gelo aahe. 💖🌹",
  ];

  const typingElement = document.querySelector(".typing-text");

  let lineIndex = 0;
  let charIndex = 0;
  const baseSpeed = 100;

function type() {

  if (lineIndex < lines.length) {

    if (charIndex < lines[lineIndex].length) {

      const currentLine = lines[lineIndex];
      const remainingText = currentLine.substring(charIndex);

      let delay = baseSpeed;

      if (remainingText.startsWith("Trupti")) {
        typingElement.innerHTML += `<span class="glow-name">Trupti</span>`;
        charIndex += 7;
        delay = 200; // pause slightly after her name
      } else {
        const char = currentLine.charAt(charIndex);
        typingElement.innerHTML += char;
        charIndex++;

        // Natural pauses
        if (char === "," ) delay = 250;
        if (char === "…") delay = 350;
        if (char === ".") delay = 300;
      }

      setTimeout(type, delay);

    } else {

      if (lineIndex < lines.length - 1) {
        typingElement.innerHTML += "<br/>";
      }

      lineIndex++;
      charIndex = 0;
      setTimeout(type, 300);
    }
  }
}

  // Slight delay before typing starts
  setTimeout(type, 1200);
}