document.addEventListener('DOMContentLoaded', () => {
  const scenes = {
    title: document.getElementById('titleScene'),
    character: document.getElementById('characterScene'),
    puppy: document.getElementById('puppyScene'),
    item: document.getElementById('itemScene'),
    name: document.getElementById('nameScene'),
    house: document.getElementById('houseScene'),
    tamagotchi: document.getElementById('tamagotchiScene'),
  };

  let selectedCharacter = null;
  let selectedPuppy = null;
  let selectedItems = [];
  let playerName = '';
  let puppyName = '';

  function showScene(name) {
    for (const key in scenes) {
      scenes[key].classList.remove('active');
    }
    scenes[name].classList.add('active');
  }

  // Start button
  document.getElementById('startBtn').addEventListener('click', () => {
    showScene('character');
  });

  // Character selection
  document.querySelectorAll('#characterScene .character').forEach(elem => {
    elem.addEventListener('click', () => {
      document.querySelectorAll('#characterScene .character').forEach(c => c.classList.remove('selected'));
      elem.classList.add('selected');
      selectedCharacter = elem.dataset.id;
      setTimeout(() => showScene('puppy'), 300);
    });
  });

  // Puppy selection
  document.querySelectorAll('#puppyScene .puppy').forEach(elem => {
    elem.addEventListener('click', () => {
      document.querySelectorAll('#puppyScene .puppy').forEach(p => p.classList.remove('selected'));
      elem.classList.add('selected');
      selectedPuppy = elem.dataset.id;
      setTimeout(() => showScene('item'), 300);
    });
  });

  // Item selection form
  document.getElementById('itemForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const checkboxes = document.querySelectorAll('input[name="items"]:checked');
    selectedItems = Array.from(checkboxes).map(cb => cb.value);
    showScene('name');
  });

  // Name form
  const nameForm = document.getElementById('nameForm');
  const nameHint = document.getElementById('nameHint');
  nameForm.addEventListener('submit', (e) => {
    e.preventDefault();
    playerName = document.getElementById('playerName').value.trim();
    puppyName = document.getElementById('puppyName').value.trim();
    if (!playerName || !puppyName) return;
    const firstLetter = playerName.charAt(0).toLowerCase();
    if (puppyName.charAt(0).toLowerCase() !== firstLetter) {
      nameHint.style.display = 'block';
      return;
    }
    nameHint.style.display = 'none';
    // Set puppy image in house
    document.getElementById('puppyHouse').src = `assets/puppies/${selectedPuppy}_sleep.png`;
    document.getElementById('puppyHouse').style.display = 'block';
    document.getElementById('houseExterior').classList.remove('hidden');
    document.getElementById('houseInterior').classList.add('hidden');
    document.getElementById('houseText').textContent = `${playerName}, your puppy ${puppyName} is settling in. It will sleep in the laundry tonight.`;
    document.getElementById('nextMorningBtn').textContent = 'Next';
    showScene('house');
  });

  // House scene: handle transitions
  const nextBtn = document.getElementById('nextMorningBtn');
  nextBtn.addEventListener('click', () => {
    const exterior = document.getElementById('houseExterior');
    const interior = document.getElementById('houseInterior');
    const text = document.getElementById('houseText');
    if (!exterior.classList.contains('hidden')) {
      exterior.classList.add('hidden');
      interior.classList.remove('hidden');
      text.textContent = `${puppyName} is sleeping peacefully in the laundry...`;
      nextBtn.textContent = 'Morning';
    } else {
      // move to tamagotchi scene
      prepareTamagotchi();
      showScene('tamagotchi');
    }
  });

  // Tamagotchi logic
  const dogImg = document.getElementById('tamagotchiDog');
  const hungerFill = document.getElementById('hungerFill');
  const funFill = document.getElementById('funFill');
  const cleanFill = document.getElementById('cleanFill');
  const energyFill = document.getElementById('energyFill');
  const statusMsg = document.getElementById('statusMsg');
  let tamagotchiTimer;

  const stats = {
    hunger: 100,
    fun: 100,
    clean: 100,
    energy: 100
  };
  let currentState = 'idle';
  let actionTimeout;

  function updateBars() {
    hungerFill.style.width = stats.hunger + '%';
    funFill.style.width = stats.fun + '%';
    cleanFill.style.width = stats.clean + '%';
    energyFill.style.width = stats.energy + '%';
  }

  function degradeStats() {
    // Called periodically to decrease stats
    stats.hunger = Math.max(0, stats.hunger - 5);
    stats.fun = Math.max(0, stats.fun - 3);
    stats.clean = Math.max(0, stats.clean - 2);
    stats.energy = Math.max(0, stats.energy - 4);
    updateBars();
    checkStatus();
  }

  function checkStatus() {
    if (stats.hunger <= 20) {
      statusMsg.textContent = `${puppyName} is hungry! Feed it!`;
    } else if (stats.fun <= 20) {
      statusMsg.textContent = `${puppyName} is bored. Time to play!`;
    } else if (stats.clean <= 20) {
      statusMsg.textContent = `${puppyName} needs brushing.`;
    } else if (stats.energy <= 20) {
      statusMsg.textContent = `${puppyName} is tired. Maybe walk or rest.`;
    } else {
      statusMsg.textContent = `${puppyName} is happy and content.`;
    }
  }

  function setDogState(state, duration = 2000) {
    currentState = state;
    dogImg.src = `assets/puppies/${selectedPuppy}_${state}.png`;
    if (actionTimeout) clearTimeout(actionTimeout);
    if (state !== 'idle') {
      actionTimeout = setTimeout(() => {
        setDogState('idle', 0);
      }, duration);
    }
  }

  function feed() {
    stats.hunger = Math.min(100, stats.hunger + 30);
    setDogState('eat');
    statusMsg.textContent = `${puppyName} enjoys the meal.`;
    updateBars();
  }
  function playBall() {
    stats.fun = Math.min(100, stats.fun + 30);
    stats.energy = Math.max(0, stats.energy - 10);
    setDogState('play');
    statusMsg.textContent = `${puppyName} loves chasing the ball!`;
    updateBars();
  }
  function train() {
    stats.fun = Math.min(100, stats.fun + 20);
    stats.energy = Math.max(0, stats.energy - 15);
    setDogState('train');
    statusMsg.textContent = `${puppyName} learned a new trick!`;
    updateBars();
  }
  function brush() {
    stats.clean = Math.min(100, stats.clean + 40);
    setDogState('brush');
    statusMsg.textContent = `${puppyName} is being brushed.`;
    updateBars();
  }
  function walk() {
    stats.energy = Math.min(100, stats.energy + 30);
    stats.fun = Math.min(100, stats.fun + 10);
    setDogState('walk');
    statusMsg.textContent = `${puppyName} enjoys the walk.`;
    updateBars();
  }
  function resetDog() {
    stats.hunger = 100;
    stats.fun = 100;
    stats.clean = 100;
    stats.energy = 100;
    updateBars();
    setDogState('idle', 0);
    statusMsg.textContent = `${puppyName} has been reset and is happy!`;
  }

  function prepareTamagotchi() {
    // initialize tamagotchi scene when entering
    stats.hunger = 80;
    stats.fun = 80;
    stats.clean = 80;
    stats.energy = 80;
    updateBars();
    dogImg.src = `assets/puppies/${selectedPuppy}_idle.png`;
    statusMsg.textContent = `${puppyName} is ready to play!`;
    // Clear previous timer
    if (tamagotchiTimer) clearInterval(tamagotchiTimer);
    tamagotchiTimer = setInterval(degradeStats, 7000);
  }

  // Action buttons
  document.getElementById('feedBtn').addEventListener('click', feed);
  document.getElementById('playBtn').addEventListener('click', playBall);
  document.getElementById('trainBtn').addEventListener('click', train);
  document.getElementById('brushBtn').addEventListener('click', brush);
  document.getElementById('walkBtn').addEventListener('click', walk);
  document.getElementById('resetBtn').addEventListener('click', resetDog);

});
