const wordsList = ["ab"]
const wrongLetterTag = document.querySelector(".wrong-letter")
const dollyImgs = ["./imgs/hangman0.png", "./imgs/hangman1.png", "./imgs/hangman2.png", "./imgs/hangman3.png", "./imgs/hangman4.png"]
const dollyContainer = document.querySelector(".dolly-container")
const buttonLetters = document.querySelectorAll(".button-letter")
const wordInput = document.querySelector(".input-word")
const restartButton = document.querySelector(".restart-button")
const matchTime = document.querySelector(".input-time");
const westedWordsInput = document.querySelector(".input-wasted")
const modalsDiv = document.createElement("div")
const ONE_SECOND_INTERVAL = 1000
const THREE_SECOND_TIMEOUT = 3000
const LAST_INDEX_OFFSET = 1
let minutesLeft = 10
let numberOfChances = 4
let timerId = null;
let letterUsed = []

const timerDisplay = () => {

    if (timerId) clearInterval(timerId);

    updateDisplay(minutesLeft);

    timerId = setInterval(() => {
        if (minutesLeft <= 0) {
            clearInterval(timerId);
            timeoutAlert()
            return;
        }

        minutesLeft--;
        updateDisplay(minutesLeft);
    }, 1000);
};

const updateDisplay = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    matchTime.value = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};


const letterWrongAlert = (check) => {
    if (check.length === 0) {
        wrongLetterTag.innerText = "❌ Wrong letter"
        
        setTimeout(() => {
            wrongLetterTag.innerText = ""
        },  THREE_SECOND_TIMEOUT )
    }
}

const congratulationsWin = () => {
    
    const mainContainer = document.querySelector("body")
    const congratTag = document.createElement("h2")
    const wordTag = document.createElement("h3")
    const buttonOk = document.createElement("button")

    modalsDiv.innerHTML = ""
    modalsDiv.classList = "modal-congratulations"
    congratTag.innerHTML = "YOU WIN!!"
    wordTag.innerHTML = `The secret word is: ${randomWord.join("")}`
    
    buttonOk.innerHTML = "Acept"
    buttonOk.addEventListener("click", () => {
        modalsDiv.remove()
    })
    
    modalsDiv.appendChild(congratTag)
    modalsDiv.appendChild(wordTag)
    modalsDiv.appendChild(buttonOk)
    mainContainer.appendChild(modalsDiv)
    
}

    const timeoutAlert = () => {
        
        const mainContainer = document.querySelector("body")
        const congratTag = document.createElement("h2")
        const wordTag = document.createElement("h3")
        const buttonOk = document.createElement("button")

        modalsDiv.innerHTML = ""
        modalsDiv.classList = "modal-congratulations"
        congratTag.innerHTML = "TIME OUT!!"
        wordTag.innerHTML = `The secret word was: ${randomWord.join("")}`
        
        buttonOk.innerHTML = "Acept"
        buttonOk.addEventListener("click", () => {
            modalsDiv.remove()
        })
        
        modalsDiv.appendChild(congratTag)
        modalsDiv.appendChild(wordTag)
        modalsDiv.appendChild(buttonOk)
        mainContainer.appendChild(modalsDiv)
        
    }

const insertDolly = (chances) => {
  dollyContainer.innerHTML = ""
  
  const index = dollyImgs.length - LAST_INDEX_OFFSET - chances

  const dollyImg = document.createElement("img")
  dollyImg.src = dollyImgs[index]
  dollyImg.alt = "hangman"
  
  dollyContainer.appendChild(dollyImg)
}

const generateRandomWord = (list) => {
    
    let randomNumber = Math.floor(Math.random() * list.length)
    const randomWord = list[randomNumber].split("")
    
    return randomWord
}

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
        numberOfChances -= 1
        insertDolly(numberOfChances)
        letterWrongAlert(indexsLetter)

        if (numberOfChances <= 0) { 
            buttonLetters.forEach((button) => button.disabled = true)
            wordInput.value = randomWord.join("")
            clearInterval(timerId)
        }
    }

    if (indexsLetter.length > 0) {
        minutesLeft += 10
    }

    return partialWord
}


const checkWin = (word, partialWord) => {
    if (
        word.length === partialWord.length &&
        word.every((character, index) => character === partialWord[index])
    ) {
        minutesLeft = 0
        buttonLetters.forEach((button) => button.disabled = true)
        congratulationsWin(word)
        return true
    }
    return false
}

const checkLifes = (lifes, word) => {
    
    if(lifes === 0){
        clearInterval(timerId)
        buttonLetters.forEach((button) => button.disabled = true)
        wordInput.value = word.join("")
        return true
    }
    
    return false
}

let randomWord = generateRandomWord(wordsList)
let hiddenWord = randomWord.map(() => "_")

const initGame = () => {
    
    timerDisplay();
    insertDolly(numberOfChances);

    if (checkLifes(numberOfChances, randomWord)) return;

    wordInput.value = hiddenWord;

    buttonLetters.forEach((letter) => {
        letter.addEventListener("click", (event) => {
            const selectedLetter = event.target.innerText.toLowerCase();
            hiddenWord = unHiddenWord(selectedLetter, randomWord, hiddenWord);
            wordInput.value = hiddenWord.join(" ");

            buttonLetters.forEach(buton => {
                if (buton.innerText === event.target.innerText) buton.disabled = true;
            });

            if (checkWin(randomWord, hiddenWord)) return;
        });
    });
};

const restartGame = () => {
    if (timerId) clearInterval(timerId);

    minutesLeft = 10;
    numberOfChances = 4;
    insertDolly(numberOfChances);

    randomWord = generateRandomWord(wordsList);
    letterUsed = [];
    westedWordsInput.value = letterUsed;

    hiddenWord = randomWord.map(() => "_");
    wordInput.value = hiddenWord.join(" ");

    buttonLetters.forEach(buton => buton.disabled = false);
    modalsDiv.remove();

    timerDisplay();
};

restartButton.addEventListener("click", restartGame);

initGame();