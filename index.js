const wordsList = ["papa", "perro", "auricular", "alpargata"]
const buttonsLetters = document.querySelectorAll(".button-letter")
const wordInput = document.querySelector(".input-word")
const matchTime = document.querySelector(".input-time");
const westedWordsInput = document.querySelector(".input-wasted")
const oneSecond = 1000

let minutesLeft = 1* 60;
let life = 2
let timerId; 
let trashWord = []

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
    }, oneSecond);

    return timer;
};

const startCountdown = (duration) => {
    const timer = createCountdown(
        duration,
        (timeLeft) => { 
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;

            matchTime.value = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

            if (life < -1) { 
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
timerId = startCountdown(minutesLeft);

const generateRandomWord = (list) => {
    
    const listLength = list.length
    let randomNumber = Math.floor(Math.random() * listLength)
    const randomWord = list[randomNumber].split("")
    
    return randomWord
}

const randomWord = generateRandomWord(wordsList)
let hiddenWord = randomWord.map(() => "_")

wordInput.value = hiddenWord

const unHiddenWord = (letter, word, hiddenWord) => {
    const indexsLetter = word.reduce((matches, character, index) => {
        if (character === letter) {
            matches.push(index)
        }
        return matches
    }, [])

   trashWord.push(letter)
   westedWordsInput.value = trashWord

    let partialWord = hiddenWord.map((character, index) => {
        if (indexsLetter.includes(index)) {
            return letter
        } else {
            return character
        }
    })

    
    if (indexsLetter.length === 0 && life >= 1) {
        life -= 1;
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
    }
}

const checkLifes = (lifes, word) => {
    
    if(lifes === 0){
        alert ("NO TE QUEDAN MAS VIDAS!")
        clearInterval(timerId)
        buttonsLetters.forEach((button) => button.disabled = true)
        return wordInput.value = word
    }
        

}

const knowWord = () => {
    buttonsLetters.forEach((letter) => {
        letter.addEventListener("click", (event) => {
            
            if (checkLifes(life, randomWord)) return

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


knowWord()
