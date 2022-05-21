const manParts       = document.querySelectorAll('.figure')

const wrongLettersEl = document.querySelector('#wrong-letters')
const wordEl         = document.querySelector('#word')
const endgamePopup   = document.querySelector('#popup-container')
const finalMessage   = document.querySelector('#final-message')
const playAgainBtn   = document.querySelector('#play-button')
const notification   = document.querySelector('#notification-container')

// const wordsArr = ['application', 'programming', 'interface', 'wizard', 'perseverance']

// let selectedWord = wordsArr[Math.floor(Math.random() * wordsArr.length)]

let wrongLettersArr = []
const correctLettersArr = ['a', 'i', 'e']
let unknownWord

function showWord() {
    wordEl.innerHTML = `
    ${unknownWord
        .split("")
        .map(letter => `<span class="letter">${correctLettersArr.includes(letter) ? letter : ""}</span>`)
        .join("")}
        `
        
        const innerWord = wordEl.innerText.replace(/\n/g, '')
        
        if (innerWord === unknownWord) {
            endgamePopup.style.display = 'flex'
            finalMessage.innerText = 'Congradulations! You won!'
        }
}
    
async function getWord() {
    
    const response = await fetch('https://random-word-api.herokuapp.com/word');
    
    const data = await response.json()
    
    const selectedWord = data[0]

    console.log(selectedWord)
    
    unknownWord = selectedWord
    
    showWord()
}

function updateWrongLetters() {
    wrongLettersEl.innerHTML = `
    ${wrongLettersArr.length >= 1 ? "Wrong Letters" : ""}
    <span>${wrongLettersArr}</span>
    `

}
    
function restartGame() {
    endgamePopup.style.display = 'none'
    wrongLettersArr =[]
    updateWrongLetters()
    console.log("restart")
    getWord()
}

function correctGuess () {
    if (correctLettersArr.includes(e.key)) {
        notification.classList.add("show")
        setTimeout(() => {
            notification.classList.remove("show");
        }, 1500);
    } else {
        correctLettersArr.push(e.key)
        showWord()
    }

}

function incorrectGuess () {
    if (!wrongLettersArr.includes(e.key)) {
        wrongLettersArr.push(e.key)
        updateWrongLetters()
    } else {
        notification.classList.add("show")
        setTimeout(() => {
            notification.classList.remove("show");
        }, 1500);
    }
}

window.addEventListener('keydown', e => {   
    if (e.code.includes("Key")) {
        if (unknownWord.includes(e.key)) {
            correctGuess()
        } else {
            incorrectGuess()
        }
    }
})   

playAgainBtn.addEventListener('click', restartGame)
  
getWord()

