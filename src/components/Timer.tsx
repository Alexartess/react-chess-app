import React, {FC, useEffect, useRef, useState} from 'react';
import {Player} from "../models/Player";
import {Colors} from "../models/Colors";

interface TimerProps {
  currentPlayer: Player | null;
  restart: () => void;
}

const Timer: FC<TimerProps> = ({currentPlayer, restart}) => {
  //по умолчанию 5 мин
  const [blackTime, setBlackTime] = useState(300)
  const [whiteTime, setWhiteTime] = useState(300)
  const timer = useRef<null | ReturnType<typeof setInterval>>(null)
  const [gameOver, setGameOver] = useState(false);
  const [loser, setLoser] = useState<Colors | null>(null);

  useEffect(() => {  //стартуем таймер при каждой смене игрока
    startTimer()
  }, [currentPlayer])

  function startTimer() {
    if (timer.current) {
      clearInterval(timer.current) //обнуляем счетчик после хода игрока
    }

    // Don't start timer if game is over
    if (gameOver) return;

    //каждую секунду уменьшаем таймер
    const callback = currentPlayer?.color === Colors.WHITE ? decrementWhiteTimer : decrementBlackTimer
    timer.current = setInterval(callback, 1000)
    console.log(blackTime)
  }

  function decrementBlackTimer() {
   //проверяем достиг ли таймер нуля
    setBlackTime(prev => {
      if (prev <= 1) {
        clearInterval(timer.current!);
        setGameOver(true);
        setLoser(Colors.BLACK);
        return 0;
      }
      return prev - 1;
    });
   
  }
  function decrementWhiteTimer() {
    
    setWhiteTime(prev => {
      if (prev <= 1) {
        clearInterval(timer.current!);
        setGameOver(true);
        setLoser(Colors.WHITE);
        return 0;
      }
      return prev - 1;
    });
  }

  const handleRestart = () => {
    setWhiteTime(300)
    setBlackTime(300)
    setGameOver(false);
    setLoser(null);
    restart()
  }

  return (
    <div>
      <div>
        <button onClick={handleRestart}>Начать заново</button>
      </div>
      <h2>Черные - {blackTime}</h2>
      <h2>Белые - {whiteTime}</h2>
      {gameOver && (
                  <div className="game-over">
                      <div className="game-over-content">
                              <h2>Игра окончена!</h2>
                              <p>Победитель: {loser === Colors.WHITE ? 'Черные' : 'Белые'}</p>
                              <button onClick={handleRestart}>Начать заново</button> 
                      </div>
                      
                  </div>
                  )}
      
    </div>
  );
};

export default Timer;