document.querySelectorAll(".character").forEach(card => {
  card.addEventListener("click", () => {
    const char = card.dataset.char;
    window.location.href = `character.html?char=${char}`;
  });
});
