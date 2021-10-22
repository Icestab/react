import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// class Square extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       value: null,
//     };
//   }
//   render() {
//     return (
//       <button className="square" onClick={() => this.props.onClick()}>
//         {this.props.value}
//       </button>
//     );
//   }
// }

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}
function SortButton(props) {
  if (props.value) {
    return <button onClick={props.onClick}>↑</button>;
  } else {
    return <button onClick={props.onClick}>↓</button>;
  }
}
class Board extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     squares: Array(9).fill(null),
  //     xIsNest: true,
  //   };
  // }
  // handleClick(i) {
  //   const squares = this.state.squares.slice();
  //   if (calculateWinner(squares) || squares[i]) {
  //     return;
  //   }
  //   squares[i] = this.state.xIsNest ? 'X' : 'O';
  //   this.setState({ squares: squares, xIsNest: !this.state.xIsNest });
  // }
  renderSquare(i) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    // const winner = calculateWinner(this.state.squares);
    // let status;
    // if (winner) {
    //   status = 'Winner:' + winner;
    // } else {
    //   status = 'Next player: ' + (this.state.xIsNest ? 'X' : 'O');
    // }
    // const status = 'Next player: ' + (this.state.xIsNest ? 'X' : 'O');
    let boardRow = [];
    for (let i = 0; i < 3; i++) {
      let S = [];
      for (let j = 0; j < 3; j++) {
        S.push(this.renderSquare(j + i * 3));
      }
      boardRow.push(
        <div key={i} className="board-row">
          {S}
        </div>
      );
    }
    return <div>{boardRow}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      setpNumber: 0,
      xIsNest: true,
      coordinate: Array(9).fill(0),
      sortStatus: true,
      m: [],
    };
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.setpNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const coordinate = this.state.coordinate.slice(
      0,
      this.state.setpNumber + 1
    );
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNest ? 'X' : 'O';
    this.setState({
      history: history.concat([
        {
          squares: squares,
        },
      ]),
      setpNumber: history.length,
      xIsNest: !this.state.xIsNest,
      coordinate: coordinate.concat(i),
    });
  }

  jumpTo(step) {
    this.setState({
      setpNumber: step,
      xIsNest: step % 2 === 0,
    });
  }
  sortFuc(r) {
    this.setState({
      sortStatus: !this.state.sortStatus,
      m: r.reverse(),
    });
    if (this.state.sortStatus) {
      this.setState({
        m: r,
      });
    } else {
      this.setState({
        m: r.reverse(),
      });
    }
  }
  sortUp(moves) {
    console.log(moves);
    return moves.reverse();
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.setpNumber];
    const winner = calculateWinner(current.squares);
    const i = this.state.coordinate;
    const moves = history.map((step, move) => {
      const desc = move
        ? 'Go to move #' + move + ',coordinate is' + calculateCoor(i[move])
        : 'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
    let removes = moves;
    removes.reverse();
    let status;
    if (winner) {
      status = 'Winner:' + winner;
    } else {
      status = 'Next player:' + (this.state.xIsNest ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="top-number">
          <li>1</li>
          <li>2</li>
          <li>3</li>
        </div>
        <div className="left-number">
          <li>1</li>
          <li>2</li>
          <li>3</li>
        </div>
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>
            {status};Sort:
            <SortButton
              value={this.state.sortStatus}
              onClick={() => this.sortFuc(removes)}
            />
          </div>
          <ol>{this.state.m.length === 0 ? moves : this.state.m}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById('root'));

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
function calculateCoor(coordinate) {
  const x = parseInt(coordinate / 3) + 1;
  const y = (coordinate % 3) + 1;
  return '(' + x + ',' + y + ')';
}
