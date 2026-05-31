function updateSplashWelcome(){

  let level =
    getLevelData().level;

  if(level > 10){
    level = 10;
  }

  const splashData = [

    {
      title:
        "Welcome, Rookie 👋",

      quote:
        "Every great person started from zero."
    },

    {
      title:
        "Welcome, Grinder 🔥",

      quote:
        "Small daily consistency beats momentary motivation."
    },

    {
      title:
        "Welcome, Focused 🎯",

      quote:
        "Focus on progress, not perfection."
    },

    {
      title:
        "Welcome, Achiever ⚡",

      quote:
        "Productivity is not being busy, but getting important things done."
    },

    {
      title:
        "Welcome, Discipline 🧠",

      quote:
        "Discipline keeps you going when motivation is gone.."
    },

    {
      title:
        "Welcome, Advanced 🚀",

      quote:
        "You've come further than most people.."
    },

    {
      title:
        "Welcome, Elite 👑",

      quote:
        "High levels come from thousands of small steps."
    },

    {
      title:
        "Welcome, MasterMind 🔥",

      quote:
        "A master is not one who is perfect, but one who continues to develop."
    },

    {
      title:
        "Welcome, Legend ⚔️",

      quote:
        "Legends are shaped by years of consistency."
    },

    {
      title:
        "Welcome, Monster 💀",

      quote:
        "You are no longer chasing others. You are surpassing yourself."
    }
  ];

  const data =
    splashData[level - 1];

  document.getElementById(
    "splashLevelText"
  ).innerText =
    data.title;

  document.getElementById(
    "splashQuote"
  ).innerText =
    data.quote;
}

window.addEventListener(
  "load",
  () => {
    updateSplashWelcome();

    const splash =
      document.getElementById(
        "splashScreen"
      );

    setTimeout(() => {

      splash.classList.add(
        "splash-hide"
      );

    }, 3000);
  }
);