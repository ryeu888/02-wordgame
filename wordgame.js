let popularWords;
let allWords;


function loadGame() {
    Promise.all([
        fetch('./popular.txt')
            .then(response => response.text())
            .then(text => {
                popularWords = text.split("\r\n");
                popularWords.pop(); // Remove the '' at the end
            })
            .catch(error => {
                console.error('Error fetching words: ', error);
            }),
        fetch("./enable1.txt")
            .then(response => response.text())
            .then(text => {
                allWords = text.split("\r\n");
                allWords.pop(); // Remove the '' at the end
            })
            .catch(error => {
                console.error('Error fetching words: ', error);
            })]).finally(wordsLoaded);
}

let secret;
let popularWordsSorted={}

function wordsLoaded() {
    console.log(`Loaded ${popularWords.length} popular words and ${allWords.length} dictionary words!`)
    for (let i=0; i<popularWords.length; i++) {
        let word=popularWords[i];
        let len=word.length;
        if (popularWordsSorted[len]===undefined){
            popularWordsSorted[len]=[]
        }
        popularWordsSorted[len].push(word)
    }
    startGame()
}

let numLetters=5;
let allowedGuesses = 5;
let isGameOver = false;
let guesses = 0;

function startGame() {
    //get the array that contains words with numLetters
    let popularWordsLength=popularWordsSorted[numLetters];
    //choose random word from the array
    let randomIndex=randInt(0,popularWordsLength.length);
    secret = popularWordsLength[randomIndex];

}

const guessWord=document.getElementById("guess-word")
const guessHistory = document.getElementById("guess-history");
const gameOver = document.getElementById("gameover");
function makeGuess() {
    if(!isGameOver){
    let guess=guessWord.value;
    
    if (guess.length != numLetters) {
        return;
    }
    if (!allWords.includes(guess)) {
        guessWord.value = "";
        return;
    } 
    console.log('Guess: "${guess}"');
    // The guess is a real word with the right # of letters
    for (let i =0; i < numLetters; i++){
        let letter = guess[i].toUpperCase();
        let correct = false;
        let outofplace = false;
        if(guess[i] === secret[i]){
            guessHistory.innerHTML += `<span class="correct-letter">${letter}</span>` ;
            correct=true;
        }
        else if(!correct) {
            let copysecret = secret;
            for (let x =0; x < numLetters; x++){
            if(guess[i] === copysecret[x]){
                guessHistory.innerHTML += `<span class="out-of-place-letter">${letter}</span>` ;
                copysecret[x] = '';
                outofplace=true;
            }
        }
        if(!outofplace & !correct){
                guessHistory.innerHTML += `<span class="letter">${letter}</span>` ;
        }
        }
    }
        guessHistory.innerHTML += `<br>`;
        guessWord.value = "";
        guesses++;
        if(guesses>=allowedGuesses){
           outOfMoves();
        }
        else if(guess === secret){
           Win(); 
        }
}

}

function randInt(min, max) {
    let rand = Math.random();
    rand = rand * (max - min + 1);
    rand = rand + min;
    rand = Math.floor(rand);
    return rand;
}
function outOfMoves(){
    isGameOver = true;
    gameOver.innerHTML = "You took too many moves";
}
function Win(){
    isGameOver = true;
    gameOver.innerHTML = `<span class="Wordle">WORDLE! IN ${guesses} GUESSES</span>`;
}

// TODO: copy randInt
// TODO: write function isWord(word)

// For checking word:  json.hasOwnProperty("programming")
// For array of words: let arr = Object.keys(json) For a random word:  let word = arr[randInt(0, arr.length - 1)];`