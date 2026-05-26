// Base de datos de oraciones por categoría (Unidad 2)
const vocabularyData = {
    activities: [
        { word: "cache", sentence: "The application uses a temporary _______ to load images faster." },
        { word: "category", sentence: "Which _______ of vocabulary do you find the most difficult?" },
        { word: "contribute", sentence: "Everyone should _______ their ideas to the new project." },
        { word: "exploration", sentence: "Space _______ helps us understand other planets." },
        { word: "outdoor", sentence: "Hiking and camping are popular _______ activities." },
        { word: "pastime", sentence: "Playing chess is my grandfather's favorite _______." },
        { word: "recent", sentence: "Have you read any _______ research about artificial intelligence?" },
        { word: "target", sentence: "We finally achieved our sales _______ for this month." },
        { word: "allowed", sentence: "Pets are not _______ inside the university laboratory." }
    ],
    experiences: [
        { word: "cuisine", sentence: "I really love traditional Mexican _______ because of its flavors." },
        { word: "delicious", sentence: "The chocolate cake you baked for my birthday was _______." },
        { word: "gather", sentence: "The team will _______ in the meeting room to analyze data." },
        { word: "gigantic", sentence: "The blueprint was displayed on a _______ electronic screen." },
        { word: "impressive", sentence: "The presentation of the new autonomous robot was truly _______." },
        { word: "leisure", sentence: "In my _______ time, I enjoy developing small applications." },
        { word: "memorable", sentence: "Our trip to the rainforest was a deeply _______ experience." }
    ],
    feelings: [
        { word: "amused", sentence: "The teacher looked _______ by the student's witty answer." },
        { word: "awkward", sentence: "There was an _______ silence when the system crashed." },
        { word: "ignored", sentence: "She felt _______ when nobody replied to her urgent email." },
        { word: "impressed", sentence: "The manager was _______ with the junior developer's clean code." },
        { word: "jealous", sentence: "Don't be _______ of their success; work hard for your own." },
        { word: "joyful", sentence: "It was a _______ celebration when the project succeeded." },
        { word: "offended", sentence: "He got _______ when they criticized his layout design." },
        { word: "regretful", sentence: "He was _______ about making a hasty and wrong decision." },
        { word: "adore", sentence: "I absolutely _______ working with animals and analyzing behavior." },
        { word: "appreciate", sentence: "I really _______ your assistance during the database setup." },
        { word: "believe", sentence: "Do you _______ that technology will solve climate change?" },
        { word: "deny", sentence: "You cannot _______ that data visualization makes things clearer." },
        { word: "doubt", sentence: "I _______ they can finish the full software integration today." },
        { word: "imagine", sentence: "Can you _______ living in a world without internet access?" },
        { word: "interests", sentence: "She has strong professional _______ in wildlife protection." },
        { word: "realize", sentence: "Did you _______ that the code had a bug before deploying?" }
    ]
};

let currentPool = [];
let currentGameData = null;
let chosenWord = "";
let guessedLetters = [];
let maxLives = 6;
let currentLives = 6;
let score = 0;

function initGame() {
    const category = document.getElementById('category-select').value;
    currentPool = [...vocabularyData[category]];
    
    // Bloquear el panel de configuración durante la partida activa
    document.getElementById('config-panel').querySelectorAll('select, button').forEach(el => el.disabled = true);
    document.getElementById('game-container').style.display = 'flex';
    
    nextRound();
}

function nextRound() {
    if (currentPool.length === 0) {
        showEndOverlay(true, "¡Increíble! Completaste todas las oraciones de esta categoría.");
        return;
    }

    // Seleccionar una palabra/oración al azar y removerla de la lista temporal
    const randomIndex = Math.floor(Math.random() * currentPool.length);
    currentGameData = currentPool.splice(randomIndex, 1)[0];
    chosenWord = currentGameData.word.toLowerCase();
    
    guessedLetters = [];
    currentLives = maxLives;
    
    updateStatusBar();
    renderSentenceClue();
    renderWordSpaces();
    renderKeyboard();
}

function updateStatusBar() {
    document.getElementById('score-display').innerText = score;
    let hearts = "";
    for(let i = 0; i < maxLives; i++) {
        hearts += (i < currentLives) ? "❤️ " : "🖤 ";
    }
    document.getElementById('lives-display').innerText = hearts;
}

function renderSentenceClue() {
    // Reemplaza la línea oculta en la oración por una etiqueta estilizada visible
    const clueHtml = currentGameData.sentence.replace("_______", "<span>[ _______ ]</span>");
    document.getElementById('sentence-clue').innerHTML = clueHtml;
}

function renderWordSpaces() {
    const wordDisplay = document.getElementById('word-display');
    wordDisplay.innerHTML = "";

    for (let char of chosenWord) {
        const space = document.createElement('div');
        space.classList.add('letter-space');
        // Si es una letra adivinada la muestra, si no queda en blanco
        if (guessedLetters.includes(char)) {
            space.innerText = char;
        } else {
            space.innerText = "";
        }
        wordDisplay.appendChild(space);
    }
}

function renderKeyboard() {
    const keyboard = document.getElementById('keyboard');
    keyboard.innerHTML = "";
    const letters = "abcdefghijklmnopqrstuvwxyz".split("");

    letters.forEach(letter => {
        const button = document.createElement('button');
        button.classList.add('key');
        button.innerText = letter;
        button.addEventListener('click', () => handleGuess(letter, button));
        keyboard.appendChild(button);
    });
}

function handleGuess(letter, button) {
    guessedLetters.push(letter);
    button.disabled = true;

    if (chosenWord.includes(letter)) {
        button.classList.add('correct');
        renderWordSpaces();
        
        // Comprobar si ganó la ronda
        const won = chosenWord.split("").every(char => guessedLetters.includes(char));
        if (won) {
            score += 10;
            setTimeout(() => {
                nextRound();
            }, 800);
        }
    } else {
        button.classList.add('wrong');
        currentLives--;
        updateStatusBar();

        if (currentLives <= 0) {
            showEndOverlay(false, `GAME OVER. The correct word was: "${chosenWord.toUpperCase()}"`);
        }
    }
}

function showEndOverlay(isWin, text) {
    const overlay = document.getElementById('overlay-screen');
    const title = document.getElementById('overlay-title');
    const textEl = document.getElementById('overlay-text');

    if (isWin) {
        title.innerText = "VICTORY!";
        title.className = "overlay-title win";
    } else {
        title.innerText = "GAME OVER";
        title.className = "overlay-title";
    }

    textEl.innerText = text;
    overlay.classList.add('active');
}

function closeOverlay() {
    document.getElementById('overlay-screen').classList.remove('active');
    // Liberar los controles para jugar otra categoría
    document.getElementById('config-panel').querySelectorAll('select, button').forEach(el => el.disabled = false);
    document.getElementById('game-container').style.display = 'none';
}