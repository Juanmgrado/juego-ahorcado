const wordsList = ["papa", "perro", "auricular", "alpargata"]
const dollyImgs = ["./imgs/hangman0.png", "./imgs/hangman1.png", "./imgs/hangman2.png", "./imgs/hangman3.png", "./imgs/hangman4.png"]
const dollyContainer = document.querySelector(".dolly-container")
const buttonLetters = document.querySelectorAll(".button-letter")
const wordInput = document.querySelector(".input-word")
const restartButton = document.querySelector(".restart-button")
const matchTime = document.querySelector(".input-time");
const westedWordsInput = document.querySelector(".input-wasted")
const ONE_SECOND_INTERVAL = 1000
const LAST_INDEX_OFFSET = 1
let minutesLeft = 1* 60

let numberOfChances = 4
let timerId = null; 
let letterUsed = []

const insertDolly = (chances) => {
  dollyContainer.innerHTML = ""

  const index = dollyImgs.length - LAST_INDEX_OFFSET - chances

  const dollyImg = document.createElement("img")
  dollyImg.src = dollyImgs[index]
  dollyImg.alt = "hangman"

  dollyContainer.appendChild(dollyImg)
}
const createCountdown = (duration, onTick, onComplete) => {
    let timeLeft = duration; 
    const timer = setInterval(() => {
        if (timeLeft >= 0) {
            onTick(timeLeft); 
            timeLeft--;
        } else {
            clearInterval(timer);
            onComplete();
        }
    }, ONE_SECOND_INTERVAL);
    
    return timer;
};

const generateRandomWord = (list) => {
    
    let randomNumber = Math.floor(Math.random() * list.length)
    const randomWord = list[randomNumber].split("")
    
    return randomWord
}


const startCountdown = (duration) => {
    const timer = createCountdown(
        duration,
        (timeLeft) => { 
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            
            matchTime.value = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
            
            if (numberOfChances < -1) { 
                clearInterval(timer); 
            }
        },
        () => { 
            buttonLetters.forEach((button) => button.disabled = true);
            wordInput.value = randomWord;
        }
    );
    
    return timer;
};

const unHiddenWord = (letter, word, hiddenWord) => {
    const indexsLetter = word.reduce((matches, character, index) => {
        if (character === letter) {
            matches.push(index)
        }
        return matches
    }, [])
    
    letterUsed.push(letter)
    westedWordsInput.value = letterUsed
    
    let partialWord = hiddenWord.map((character, index) => {
        if (indexsLetter.includes(index)) {
            return letter
        } else {
            return character
        }
    })
    
    if (indexsLetter.length === 0) {
    numberOfChances -= 1;
    insertDolly(numberOfChances);

    if (numberOfChances <= 0) { 
        buttonLetters.forEach((button) => button.disabled = true);
        wordInput.value = randomWord.join("");
        clearInterval(timerId);
    }
}
    return partialWord
}

const checkWin = (word, partialWord) => {
    if (
        word.length === partialWord.length &&
        word.every((character, index) => character === partialWord[index])
    ) {
        clearInterval(timerId)
        buttonLetters.forEach((button) => button.disabled = true)
        return true
    }
    return false
}

const checkLifes = (lifes, word) => {
    
    if(lifes === 0){
        clearInterval(timerId)
        buttonLetters.forEach((button) => button.disabled = true)
        wordInput.value = word
        return true
    }
    
    return false
}

let randomWord = generateRandomWord(wordsList)
let hiddenWord = randomWord.map(() => "_")

const initGame = () => {
    timerId = startCountdown(minutesLeft);
    insertDolly(numberOfChances)
    
    if (checkLifes(numberOfChances, randomWord)) return
    
    wordInput.value = hiddenWord.join("")
    
    buttonLetters.forEach((letter) => {
        letter.addEventListener("click", (event) => {
            
            const selectedLetter = event.target.innerText;
            const letterLower = selectedLetter.toLowerCase()
            
            hiddenWord = unHiddenWord(letterLower, randomWord, hiddenWord)
            wordInput.value = hiddenWord.join("")  
                        
            buttonLetters.forEach(buton => {
                if(buton.innerText === event.target.innerText)
                    buton.disabled = true;
            })
            
            if(checkWin(randomWord, hiddenWord)) return
        })
    })
}

const restartGame = () => {
    
    numberOfChances = 4
    
    insertDolly(numberOfChances)
    
    randomWord = generateRandomWord(wordsList)
    
    letterUsed = []
    
    westedWordsInput.value = letterUsed
    
    hiddenWord = randomWord.map(() => "_")
    
    wordInput.value = hiddenWord.join("")
    
    buttonLetters.forEach(buton => {
        buton.disabled = false;
    })
     
    clearInterval(timerId)
    timerId = startCountdown(minutesLeft)
    
}

restartButton.addEventListener("click", (restartGame))

initGame()
