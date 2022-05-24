const manParts       = document.querySelectorAll('.figure')

const wrongLettersEl = document.querySelector('#wrong-letters')
const wordEl         = document.querySelector('#word')
const endgamePopup   = document.querySelector('#popup-container')
const finalMessage   = document.querySelector('#final-message')
const playAgainBtn   = document.querySelector('#play-button')
const notification   = document.querySelector('#notification-container')

let wrongLettersArr = []
let correctLettersArr = []
const manPartsArr = Array.from(manParts)
let unknownWord

// Display or update the unknown word.

function showWord() {
    wordEl.innerHTML = `
    ${unknownWord
        .split("")
        .map(letter => `<span class="letter">${correctLettersArr.includes(letter) ? letter : ""}</span>`)
        .join("")}
        `
        
        // Check if unknown word was guessed. If yes, display winning message and restart button.      
        const innerWord = wordEl.innerText.replace(/\n/g, '')

        if (innerWord === unknownWord) {
            endgamePopup.style.display = 'flex'
            finalMessage.innerText = 'Congradulations! You won!'
        }
}

// Get new unknown word from api and call function showWord.
    
async function getWord() {
    
    const response = await fetch('https://random-word-api.herokuapp.com/word');
    
    const data = await response.json()
    
    const selectedWord = data[0]

    console.log(selectedWord)
    
    unknownWord = selectedWord
    
    showWord()
}

// Show wrong letters array in DOM.

function showWrongLetters() {
    wrongLettersEl.innerHTML = `
    ${wrongLettersArr.length >= 1 ? "Wrong Letters" : ""}
    <span>${wrongLettersArr}</span>
    `
}

// Remove endgame popup, reset and restart game.
    
function restartGame() {
    endgamePopup.style.display = 'none'
    wrongLettersArr = []
    correctLettersArr = []
    manPartsArr.forEach(part => part.style.display = 'none')
    showWrongLetters()
    getWord()
}

// Display losing message and restart button.

function endGame() {
    endgamePopup.style.display = 'flex'
    finalMessage.innerText = 'Condolences! You Lost!'
}

// Process correct guess.

function correctGuess (e) {
    // Notify in case of correct guess already used.
    if (correctLettersArr.includes(e.key)) {
        notification.classList.add("show")
        setTimeout(() => {
            notification.classList.remove("show");
        }, 1500);
    // Update correctLettersArr and call function showWord.
    } else {
        correctLettersArr.push(e.key)
        showWord()
    }

}

// Process incorrect guess.

function incorrectGuess (e) {
    // Update wrong letters array with wrong guess and call function showWrongLetters.
    if (!wrongLettersArr.includes(e.key)) {
        wrongLettersArr.push(e.key)

        
        for (const part of manPartsArr) {
            if (!(part.style.display === 'block')) {
                part.style.display = "block"
                break
            }
        }
        showWrongLetters()
    // Notify in case of wrong guess already used.
    } else {
        notification.classList.add("show")
        setTimeout(() => {
            notification.classList.remove("show");
        }, 1500);
    }
}

// Listen for guess entries, filter character entries and process accordingly.

window.addEventListener('keydown', e => {   
    if (e.code.includes("Key")) {
        if (unknownWord.includes(e.key)) {
            correctGuess(e)
        } else {
            wrongLettersArr.length < 6 ? incorrectGuess(e) : endGame()
        }
    }
})   

playAgainBtn.addEventListener('click', restartGame)
  
getWord()