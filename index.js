

const wordsList = ["papa", "perro", "auricular", "alpargata", "ab"]
const wordListLength = wordsList.length;
const buttonsLetters = document.querySelectorAll(".button-letter")
let randomNumber = Math.floor(Math.random() * wordListLength)
const wordInput = document.querySelector(".input-word");
const randomWord = wordsList[randomNumber].split("")
let hiddenWord = randomWord.map(() => "_");
let life = 5
wordInput.value = hiddenWord

const unHiddenWord = (letter, word, hiddenWord) =>{
    
    const indexsLetter = word.reduce((matches, character, index) =>{
        if(character === letter ){
            matches.push(index)
        }
        return matches
    }, [])
        
    if (life === 0){
        alert("MAN PERDISTE")
        return randomWord
    }
    
    let partialWord = hiddenWord.map((character, index) =>{
        if(indexsLetter.includes(index)){
            character = letter
            return letter
        }else{
            return character
        }
        
    })

    if(indexsLetter.length === 0){
        life -= 1
        alert("ACABAS DE PERDER 1 VIDA")
        return partialWord
    }
    
    return partialWord

}
const checkWin = (word, partialWord) =>{
     if(word.length === partialWord.length && word.every((character, index) => character === partialWord[index])){
        alert ("FELICITACIONES HAS GANADO!!!!")
        return 
    }
}

const knowWord = () => {

    buttonsLetters.forEach(letter => {
        letter.addEventListener(("click"), event => {
            const selectedLetter = event.target.innerText
            const letterLower = selectedLetter.toLowerCase()
            hiddenWord = unHiddenWord(letterLower, randomWord, hiddenWord);
            wordInput.value = hiddenWord
            checkWin(randomWord, hiddenWord) 
                
            
        })
    })
}

knowWord()

    
    



