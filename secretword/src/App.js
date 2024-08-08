// CSS
import './App.css';

//React
import { useCallback, useEffect, useState} from "react";

//data
import { wordsList }  from "./data/words"

//Components
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';

const stages = [
  {id: 1, name: "start"},
  {id: 2, name: "game"},
  {id: 3, name: "end"}
]
const guessesQtd = 3;
function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList); 

  const [pickedWord, setPikedWord] = useState("");
  const [pickedCategory, setPikedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(guessesQtd);
  const [score, setScore] = useState(0);



  const pickWordAndCategory = useCallback(() => {
    // pick a random category
    const categories = Object.keys(words) 
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)];

    // pick a random category
    const word = words[category][Math.floor(Math.random() * words[category].length)]

    return {word, category};
  }, [words])
  //starts the secret
  const startGame = useCallback(() => {
    // clear all
    clearStates();
    // pick
    const {word, category } = pickWordAndCategory();
   

    // create an array of letters 
    let wordLetters = word.split("");

    wordLetters = wordLetters.map((l) => l.toLowerCase());

    //fill states
    setPikedWord(word)
    setPikedCategory(category)
    setLetters(wordLetters)
  

    setGameStage(stages[1].name)
  }, [pickWordAndCategory])

  // proccess the letter input
  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase();

    // check letter
    if (guessedLetters.includes(normalizedLetter) ||
        wrongLetters.includes(normalizedLetter)
      ) {
        return;
      }

      //push guesseed letter or remove
      if (letters.includes(normalizedLetter)) {
        setGuessedLetters((actualGuessedLetters) => [
          ...actualGuessedLetters,
          normalizedLetter,
        ])

     

      } else {
        setWrongLetters((actualWrongLetters) => [
          ...actualWrongLetters,
          normalizedLetter,
        ])
        setGuesses((actualGuesses) => actualGuesses - 1)

      }
  }
  const clearStates = ()  => {
    setGuesses(3);
    setGuessedLetters([]);
    setWrongLetters([]);
  }
        useEffect(() => {
          if(guesses <= 0) {
            // reset all states
            clearStates()


        setGameStage(stages[2].name)

          }
          
        }, [guesses])

    // check win
     
    useEffect(() => {
      
      const uniqueLtters = [...new Set(letters)]

      // win condition 
      if(guessedLetters.length === uniqueLtters.length && gameStage === stages[1].name) {
        //add score
        setScore((actualScore) => actualScore += 100)

        // restart game
        startGame();


      }
      
    }, [gameStage, guessedLetters, letters, startGame])



  // restarts the game
  const retry = () => {
    setScore(0)
    setGuesses(guessesQtd)
    setGameStage(stages[0].name)
  }

  return (
    <div className="App">
      {gameStage === "start" && <StartScreen startGame={startGame}/>}

      {gameStage === "game" && (
      <Game 
      verifyLetter={verifyLetter}
      pikedWord={pickedWord}
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
      /> 
      )}

      {gameStage === "end" && <GameOver retry={retry} score={score}/>}
    </div>
  );
}

export default App;
