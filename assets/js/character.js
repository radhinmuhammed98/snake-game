const CHARACTERS = {
  sayipp: {
    name: "Sayipp",
    head: "assets/heads/sayipp.jpg",
    desc: "Cold. Calculated. Precision without emotion."
  },
  vaasu: {
    name: "Vaasu",
    head: "assets/heads/vaasu.jpg",
    desc: "Unpredictable. Ruthless. Always accelerating."
  },
  dashamoolam: {
    name: "Dashamoolam",
    head: "assets/heads/dashamoolam.jpg",
    desc: "Slow burn chaos. Ends everything."
  }
};

const params = new URLSearchParams(window.location.search);
const key = params.get("char");

const character = CHARACTERS[key] || CHARACTERS.sayipp;

document.getElementById("char-name").textContent = character.name;
document.getElementById("char-img").src = character.head;
document.getElementById("char-desc").textContent = character.desc;

initGame(character.head);
