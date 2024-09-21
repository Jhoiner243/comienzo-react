import { useState } from "react";
import confetti from "canvas-confetti";
import { Square } from "./components/Square.jsx";
import { TURNS} from "./constants.js";
import { checkWinner } from "./Logic/board.js";
import { WinnerModal } from "./components/Winner.jsx";


function App() {
  const [board, setBoard] = useState(()=>{
    const boardFromStorage = window.localStorage.getItem("board");
    return boardFromStorage ? JSON.parse(boardFromStorage) : Array(9).fill(null);
  });
  const [turn, setTurn] = useState(()=>{
  const turnFromStorage = window.localStorage.getItem("turn");
  return turnFromStorage ?? TURNS.X;

});
  const [winner, setWinner] = useState(null);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setTurn(TURNS.X);
    setWinner(null);

    
    window.localStorage.removeItem("board");
    window.localStorage.removeItem("turn");
  };
  const checkEndGame = (newBoard) => {
    //Verificamos hay un empate
    //Si no hay espacios vacios 
    //En el tablero  
    return newBoard.every((Square)=> Square !== null);
  }

  // Función para verificar si hay un ganador


  const updateBoard = (index) => {
    // Evita sobreescribir una casilla ya seleccionada o continuar si ya hay un ganador
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = turn;
    setBoard(newBoard);

    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X;
    setTurn(newTurn);

    //Guardamos en el local storage el estado del juego
    window.localStorage.setItem("board", JSON.stringify(newBoard));
    window.localStorage.setItem("turn", newTurn);

    const newWinner = checkWinner(newBoard);
    if (newWinner) {
      confetti()
      setWinner(newWinner);
    } else if ( checkEndGame(newBoard)){
      setWinner(false); //empate
    }
  };

  return (
    <main className="board">
      <h1>Tic tac toe</h1>
      <button onClick={resetGame}>Reiniciar </button>
      <section className="game">
        {board.map((_, index) => {
          return (
            <Square key={index} index={index} updateBoard={updateBoard}>
              {_}
            </Square>
          );
        })}
      </section>
      <section className="turn">
        <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
        <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
      </section>
      <section>
        <WinnerModal resetGame={resetGame} winner={winner} />
      </section>
    </main>
  );
}

export default App;
