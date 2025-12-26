const CHARACTERS = {
  sayipp: {
    name: "Sayipp",
    head: "assets/heads/sayipp.jpg"
  },
  vaasu: {
    name: "Vaasu",
    head: "assets/heads/vaasu.jpg"
  },
  dashamoolam: {
    name: "Dashamoolam",
    head: "assets/heads/dashamoolam.jpg"
  }
};

const params = new URLSearchParams(location.search);
const key = params.get("char") || "sayipp";
const char = CHARACTERS[key];

document.getElementById("char-name").textContent = char.name;
initGame(char.head);
