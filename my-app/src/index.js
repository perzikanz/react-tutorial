import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

/**
 * X又はOを表示するボタンのコンポーネント
 * @param {string} props.value X又はOの文字列
 * @param {func} props.onClick GameコンポーネントのhandleClick
 */
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

/**
 * Squareコンポーネントを9つ表示するコンポーネント
 * @param {string} props.squares X又はOの文字列
 * @param {fanc} props.onClick GameコンポーネントのhandleClick
 */
class Board extends React.Component {
  // Squareコンポーネントを呼び出す
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

/**
 * 盤面と手番を管理し、ステータスメッセージや'前の手番に戻るボタン'を表示するコンポーネント
 */
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  // クリックすると呼び出され、盤面を更新する
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1); // 現在までの全ての盤面の配列
    const current = history[history.length - 1];  // オブジェクトとしての現在の盤面
    const squares = current.squares.slice();  // 配列としての現在の盤面
    // 決着がついているか、既にXかOが入っていたら何もしない
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';  // クリックされた箇所に、X又はOの、現在の手番である方を入れる
    // Stateを更新する
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  // 前の手番に戻る
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history; // 盤面すべてが入った配列
    const current = history[this.state.stepNumber]; // 表示させたい盤面
    const winner = calculateWinner(current.squares);  // calculateWinnerに配列を渡して、勝者がいるか確認する

    // 前の手番に戻るためのボタンを作成
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    // ゲームのステータスメッセージを作成
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

/**
 * X又はOが勝利しているか判断する
 * @param {string[]} squares X又はOが入っている配列
 * @return {string|null} X又はO
 */
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================
  
ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
  