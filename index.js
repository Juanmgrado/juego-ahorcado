console.log("Script cargado")


const wordsList = ["papa", "perro", "auricular"]
const wordListLength = wordsList.length;
const buttonsLetters = document.querySelectorAll(".button-letter")
let randomNumber = Math.floor(Math.random() * wordListLength)
const wordInput = document.querySelector(".input-word");
const randomWord = wordsList[randomNumber].split("")
let hiddenWord = randomWord.map(() => "_");
let life = 5
wordInput.value = hiddenWord
console.log(randomWord)
console.log(hiddenWord)


const unHiddenWord = (letter, word, hiddenWord) =>{

    const indexsLetter = word.reduce((acc, lett, index) =>{
        if(lett === letter ){
            acc.push(index)
        }
        return acc
    }, [])

    console.log(indexsLetter);
    
    if (life === 0){
        alert("SOS UNA VERGA MAN PERDISTE")
        return randomWord
    }
    
    let partialWord = hiddenWord.map((lett, index) =>{
        if(indexsLetter.includes(index)){
            lett = letter
            return letter
        }else{
            return lett
        }
        
    })
    if(indexsLetter.length === 0){
        life -= 1
        alert("ACABAS DE PERDER 1 VIDA")
        return partialWord
    }
    
    console.log(partialWord);
    return partialWord

}

const knowWord = () => {

    buttonsLetters.forEach(letter => {
        letter.addEventListener(("click"), event => {
            const selectedLetter = event.target.innerText
            const letterLower = selectedLetter.toLowerCase()
            console.log(selectedLetter);     
            hiddenWord = unHiddenWord(letterLower, randomWord, hiddenWord);
            wordInput.value = hiddenWord 
                
            
        })
    })
}

knowWord()

    
    



