// =========================
// PREMIUM STATE
// =========================
let currentUser = null;
let isPremiumUser = false;

// =========================
// BUILT-IN IMAGES
// =========================
const builtInImages = [
  { category: "fantasy", name: "Angel", value: "fantasy/angel.png" },
  { category: "fantasy", name: "Bigfoot", value: "fantasy/bigfoot.png" },
  { category: "fantasy", name: "Fairy", value: "fantasy/fairy.png" },
  { category: "fantasy", name: "Gnome", value: "fantasy/gnome.png" },
  { category: "fantasy", name: "Mummy", value: "fantasy/mummy.png" },
  { category: "fantasy", name: "Orch", value: "fantasy/orch.png" },
  { category: "fantasy", name: "Skeleton", value: "fantasy/skeleton.png" },
  { category: "fantasy", name: "Spider", value: "fantasy/spider.png" },
  { category: "fantasy", name: "Vampire", value: "fantasy/vampire.png" },
  { category: "fantasy", name: "Werewolf", value: "fantasy/werewolf.png" },

  { category: "nature", name: "Amazon", value: "nature/amazon.png" },
  { category: "nature", name: "Banff", value: "nature/banff.png" },
  { category: "nature", name: "Grandcanyon", value: "nature/grandcanyon.png" },
  { category: "nature", name: "Greatbarrier", value: "nature/greatbarrier.png" },
  { category: "nature", name: "Mounteverest", value: "nature/mounteverest.png" },
  { category: "nature", name: "Niagrafall", value: "nature/niagrafall.png" },
  { category: "nature", name: "Rocky", value: "nature/rocky.png" },
  { category: "nature", name: "Yellowstone", value: "nature/yellowstone.png" },
  { category: "nature", name: "Yosemite", value: "nature/yosemite.png" },
  { category: "nature", name: "Zion", value: "nature/zion.png" },

  { category: "space", name: "Blackhole", value: "space/blackhole.png" },
  { category: "space", name: "Earth", value: "space/earth.png" },
  { category: "space", name: "Galaxy", value: "space/galaxy.png" },
  { category: "space", name: "Jupiter", value: "space/jupiter.png" },
  { category: "space", name: "Mars", value: "space/mars.png" },
  { category: "space", name: "Milkyway", value: "space/milkyway.png" },
  { category: "space", name: "Moon", value: "space/moon.png" },
  { category: "space", name: "Nebula", value: "space/nebula.png" },
  { category: "space", name: "Saturn", value: "space/saturn.png" },
  { category: "space", name: "Supernova", value: "space/supernova.png" },

  { category: "city", name: "Barcelona", value: "city/barcelona.png" },
  { category: "city", name: "Dubai", value: "city/dubai.png" },
  { category: "city", name: "London", value: "city/london.png" },
  { category: "city", name: "NewYork", value: "city/newyork.png" },
  { category: "city", name: "Pairs", value: "city/pairs.png" },
  { category: "city", name: "Rome", value: "city/rome.png" },
  { category: "city", name: "San Fransico", value: "city/san fransico.png" },
  { category: "city", name: "Sydney", value: "city/sydney.png" },
  { category: "city", name: "Tokyo", value: "city/tokyo.png" },
  { category: "city", name: "Venice", value: "city/venice.png" },

  { category: "animal", name: "Bear", value: "animal/bear.png" },
  { category: "animal", name: "Eagle", value: "animal/eagle.png" },
  { category: "animal", name: "Elephant", value: "animal/elephant.png" },
  { category: "animal", name: "Elk", value: "animal/elk.png" },
  { category: "animal", name: "Fox", value: "animal/fox.png" },
  { category: "animal", name: "Leopard", value: "animal/leopard.png" },
  { category: "animal", name: "Lion", value: "animal/lion.png" },
  { category: "animal", name: "Moose", value: "animal/moose.png" },
  { category: "animal", name: "Tiger", value: "animal/tiger.png" },
  { category: "animal", name: "Wolf", value: "animal/wolf.png" },

  { category: "abstract", name: "Abstact1", value: "abstract/ab1.png" },
  { category: "abstract", name: "Abstact2", value: "abstract/ab2.png" },
  { category: "abstract", name: "Abstact3", value: "abstract/ab3.png" },
  { category: "abstract", name: "Abstact4", value: "abstract/ab4.png" },
  { category: "abstract", name: "Abstact5", value: "abstract/ab5.png" },
  { category: "abstract", name: "Abstact6", value: "abstract/ab6.png" },
  { category: "abstract", name: "Abstact7", value: "abstract/ab7.png" },
  { category: "abstract", name: "Abstact8", value: "abstract/ab8.png" },
  { category: "abstract", name: "Abstact9", value: "abstract/ab9.png" },
  { category: "abstract", name: "Abstact10", value: "abstract/ab10.png" }
];

let boardSize = 4;
let tiles = [];
let solvedTiles = [];
let currentImage = "images/castle.png";
let moves = 0;
let gameStarted = false;
let hasWon = false;
let celebrationArmed = false;

let fireworks = [];
let particles = [];

let savedImages = JSON.parse(localStorage.getItem("puzzleSavedBackgrounds")) || [];
