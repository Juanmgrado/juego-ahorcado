const wordsList = ["papa", "perro", "auricular", "alpargata"]
const buttonsLetters = document.querySelectorAll(".button-letter")
const wordInput = document.querySelector(".input-word")
const restartButton = document.querySelector(".restart-button")
const matchTime = document.querySelector(".input-time");
const westedWordsInput = document.querySelector(".input-wasted")
const ONE_SECOND_INTERVAL = 1000
const NUMBER_OF_CHANCES = 2
let minutesLeft = 1* 60;

let numberOfChances = NUMBER_OF_CHANCES
let timerId = null; 
let letterUsed = []

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
            alert("SE HA AGOTADO EL TIEMPO!");
            buttonsLetters.forEach((button) => button.disabled = true);
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
    
    
    if (indexsLetter.length === 0 && numberOfChances >= 1) {
        numberOfChances -= 1;
        alert ("ACABAS DE PERDER 1 VIDA!")
        return partialWord
    }
    
    if (indexsLetter.length > 0) {
        clearInterval(timerId);         
        timerId = startCountdown(minutesLeft); 
    }
    
    return partialWord
}

const checkWin = (word, partialWord) => {
    if (
        word.length === partialWord.length &&
        word.every((character, index) => character === partialWord[index])
    ) {
        alert(`FELICITACIONES HAS GANADO, LA PALABRA ES: ${word.join("").toUpperCase()}`)
        clearInterval(timerId)
        buttonsLetters.forEach((button) => button.disabled = true)
        return true
    }
    return false
}

const checkLifes = (lifes, word) => {
    
    if(lifes === 0){
        alert ("NO TE QUEDAN MAS VIDAS!")
        clearInterval(timerId)
        buttonsLetters.forEach((button) => button.disabled = true)
        wordInput.value = word
        return true
    }
    
    return false
}

let randomWord = generateRandomWord(wordsList)
let hiddenWord = randomWord.map(() => "_")

const initGame = () => {
    timerId = startCountdown(minutesLeft);
    
    wordInput.value = hiddenWord
    
    buttonsLetters.forEach((letter) => {
        letter.addEventListener("click", (event) => {
            
            if (checkLifes(numberOfChances, randomWord)) return
            
            const selectedLetter = event.target.innerText;
            const letterLower = selectedLetter.toLowerCase()
            
            hiddenWord = unHiddenWord(letterLower, randomWord, hiddenWord)
            wordInput.value = hiddenWord  
            
            buttonsLetters.forEach(buton => {
                if(buton.innerText === event.target.innerText)
                    buton.disabled = true;
            })
            
            if(checkWin(randomWord, hiddenWord)) return
        })
    })
}

const restartGame = () => {
    
    numberOfChances = NUMBER_OF_CHANCES
    
    randomWord = generateRandomWord(wordsList)
    
    letterUsed = []
    
    westedWordsInput.value = letterUsed

    hiddenWord = randomWord.map(() => "_")

    wordInput.value = hiddenWord
    
    buttonsLetters.forEach(buton => {
        buton.disabled = false;
    })
     
    clearInterval(timerId)
    timerId = startCountdown(minutesLeft)
 
}

restartButton.addEventListener("click", (restartGame))

initGame()
