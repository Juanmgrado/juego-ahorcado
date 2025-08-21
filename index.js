const wordsList = ["papa", "perro", "auricular", "alpargata"]
const buttonsLetters = document.querySelectorAll(".button-letter")
const wordInput = document.querySelector(".input-word")

let life = 2

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

    return partialWord
}

const checkWin = (word, partialWord) => {
    if (
        word.length === partialWord.length &&
        word.every((character, index) => character === partialWord[index])
    ) {
        alert(`FELICITACIONES HAS GANADO, LA PALABRA ES: ${word.join("").toUpperCase()}`)
        buttonsLetters.forEach((button) => button.disabled = true)
    }
}

const checkLifes = (lifes, word) => {
    
    if(lifes === 0){
        alert ("NO TE QUEDAN MAS VIDAS!")
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
            checkWin(randomWord, hiddenWord)
        })
    })
}


knowWord()
