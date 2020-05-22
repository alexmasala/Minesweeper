import React, { Component } from "react";
import Timer from "./Components/Timer";
import Count from "./Components/CounterCells";
import Cell from "./Components/FlaggedCells";
import styled from "styled-components";
import Field from "./Field";

/* <audio src="sound/FatalityAudio.mp3" id="sound"></audio>
var sound=document.getElementById('sound'); */
const Game = styled.div`
  max-width: ${props => props.fieldWidth * 42 + "px"};
  margin: 0 auto;
  color: #ab8e6a;
`;

const Panel = styled.div`
  display: flex;
  justify-content: space-between;
  font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
    monospace;
  font-size: 2rem;
  color: #ab8e6a;
`;

const Mood = styled.button`
  cursor: pointer;
  border: 0;
  background: none;
  font-size: 2rem;
  &:focus {
    outline: 3px solid rgba(59, 153, 252, 0.7);
  }
`;

const Scroll = styled.div`
  overflow-x: auto;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Wrapper = styled.span`
  border: 1px solid #a19385;
  display: flex;
  flex-wrap: wrap;
  width: ${props => props.fieldWidth * 42 + "px"};
`;

const Difficulty = styled.span`
  display: flex;
  justify-content: space-around;
  align-items: center;
  font-size: 1.2rem;
  color: #2e5266;
  margin-top: 10px;
`;

const Select = styled.select`
  display: inline-block;
  width: auto;
  font-size: 1rem;
  font-weight: normal;
  color: #2e5266;
  line-height: 1.3;
  padding: 0.6em 1.4em 0.5em 0.8em;
  max-width: 100%;
  box-sizing: border-box;
  margin: 0;
  border: 1px solid #aaa;
  box-shadow: 0 1px 0 1px rgba(0, 0, 0, 0.04);
  border-radius: 0.3em;
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
  background-color: #fff;
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%232E5266%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E"),
    linear-gradient(to bottom, #ffffff 0%, #e5e5e5 100%);
  background-repeat: no-repeat, repeat;
  background-position: right 0.7em top 50%, 0 0;
  background-size: 0.65em auto, 100%;
  &:focus {
    border-color: #aaa;
    box-shadow: 0 0 1px 3px rgba(59, 153, 252, 0.7);
    box-shadow: 0 0 0 3px -moz-mac-focusring;
    outline: none;
  }
  &::-ms-expand {
    display: none;
  }
`;

class App extends Component {
  constructor(props) {
    super(props);

    // Game is initialized
    const f = new Field(9, 9, 10);
    f.init();
    this.state = {
      mood: "🙂", 
      isOpened: new Set(),
      isFlagged: new Set(),
      difficulty: "Beginner",
      field: f,
      restarted: 0
    };

    this.handleLeftClick = this.handleLeftClick.bind(this);
    this.openMines = this.openMines.bind(this);
    this.restartGame = this.restartGame.bind(this);
    this.handleDifficultyChange = this.handleDifficultyChange.bind(this);
  
    var sendScoreToAPI = () => {
      //get player name from browser prompt
      var playerName = prompt("Congrats for winning the game! Please enter your name: ", "Alexa");
      if (playerName != null) {
        var dataToSave = {
          playerScore: 10, //replace 10 with your actual variable (probably this.state.gameScore or this.state.time)
          playerName: playerName,
          currentTime: new Date()
        };
        // Actual API call
        fetch(
          "https://api.example.com/minesweeper", // replace with the url to your API
          {method: 'POST', body: JSON.stringify(dataToSave)}
          )
          .then(res => res.json())
          .then(
            (result) => {
              alert('You saved your score');
            },
            // Note: it's important to handle errors here
            (error) => {
              alert('Bad API call');
              console.log(error);
            }
          )
      }
    }
  }

  /*
      easy:   9x9, 10 mines
      medium: 16x16, 40 mines
      hard:   30x16, 99 mines
    */
  handleDifficultyChange(event) {
    let width, height, mines;
    switch (event.target.value) {
      case "Beginner":
        width = 9;
        height = 9;
        mines = 10;
        break;
      case "Intermediate":
        width = 16;
        height = 16;
        mines = 40;
        break;
      case "Advanced":
        width = 30;
        height = 16;
        mines = 99;
        break;
      default:
        width = 9;
        height = 9;
        mines = 10;
        break;
    }
    const f = new Field(width, height, mines);
    f.init();
    this.setState({
      mood: "🙂", 
      isOpened: new Set(),
      isFlagged: new Set(),
      difficulty: event.target.value,
      field: f,
      restarted: this.state.restarted + 1
    });
  }

  openMines() {
    const opened = this.state.isOpened;
    for (let i = 0; i < this.state.field.width * this.state.field.height; i++) {
      if (this.state.field.data[i] === "💣" && !this.state.isFlagged.has(i))
        opened.add(i);
      // it opens cell with a flag that placed not on the mine
      if (this.state.field.data[i] !== "💣" && this.state.isFlagged.has(i))
        opened.add(i);
    }
    return opened;
  }

  handleLeftClick(cell) {
    // won or lost disables clicks
    if (this.state.mood !== "🙂") {
      return;
    }

    if (this.state.isFlagged.has(cell.index)) {
      return;
    }

    if (cell.value > 0 && this.state.isOpened.has(cell.index)) {
      let flags = 0;
      const nearest = this.state.field.closestCells(
        cell.position.i,
        cell.position.j
      );
      nearest.forEach(coordinates => {
        const index = coordinates[0] * this.state.field.width + coordinates[1];
        if (this.state.isFlagged.has(index)) {
          flags++;
        }
      });

      if (flags === cell.value) {
        const opened = this.state.isOpened;
        const closest = this.state.field.closest(
          cell.position.i,
          cell.position.j
        );
        let gameOver = false;
        const f = this.state.field;
        closest.forEach(cellIndex => {
          if (!this.state.isFlagged.has(cellIndex)) {
            if (f.data[cellIndex] === "💣") {
              f.data[cellIndex] = "💥";
              gameOver = true;
            }
            opened.add(cellIndex);
          }
        });
        // var  soundFlag=true;
        if (gameOver) {
          this.setState({ mood: "😵", field: f, isOpened: this.openMines() });
          return;
          // if(soundFlag) {
          //   sound.pause();
          //   sound.currentTime=0;
          //   sound.onplay();
          //   soundFlag=false;
          //}
        }
        this.setState({
          isOpened: opened
        });
      }
    }

    const opened = this.state.isOpened;
    opened.add(cell.index);
    this.setState({
      isOpened: opened
    });

    if (cell.value === "💣" && this.state.mood !== "😎") {
      const f = this.state.field;
      f.data[cell.index] = "💥";
      this.setState({ mood: "😵", field: f, isOpened: this.openMines() });
    }

    if (cell.value === 0) {
      const opened = this.state.isOpened;
      const closest = this.state.field.closest(
        cell.position.i,
        cell.position.j
      );
      closest.forEach(element => {
        if (!this.state.isFlagged.has(element)) opened.add(element);
      });
      this.setState({
        isOpened: opened
      });
    }

    if (
      this.state.isOpened.size ===
        this.state.field.width * this.state.field.height -
          this.state.field.mines &&
      cell.value !== "💣"
    ) {
      this.setState({
        mood: "😎"
      });
    }
  }

  handleRightClick(cell) {
    // won or lost disables clicks
    if (this.state.mood !== "🙂") {
      return;
    }

    if (this.state.isOpened.has(cell.index)) {
      return;
    }

    const flagged = this.state.isFlagged;
    if (flagged.has(cell.index)) {
      flagged.delete(cell.index);
    } else {
      flagged.add(cell.index);
    }

    this.setState({
      isFlagged: flagged
    });
  }

  restartGame() {
    const restart = this.state.restarted + 1;
    const f = new Field(
      this.state.field.width,
      this.state.field.height,
      this.state.field.mines
    );
    f.init();
    this.setState({
      mood: "🙂",
      isOpened: new Set(),
      isFlagged: new Set(),
      field: f,
      restarted: restart
    });
  }

  render() {
    let isEven = false;
    this.grid = [];
    for (let i = 0; i < this.state.field.height; i++) {
      for (let j = 0; j < this.state.field.width; j++) {
        const index = i * this.state.field.width + j;
        isEven = !isEven;
        const isFirstInRow =
          (index + 1) % this.state.field.width === 1 ? true : false;
        if (isFirstInRow && this.state.field.width % 2 === 0) isEven = !isEven;
        this.grid.push(
          <Cell
            key={index.toString()}
            isEven={isEven}
            index={index}
            coordinates={{ i: i, j: j }}
            value={this.state.field.data[index]}
            isOpened={this.state.isOpened.has(index)}
            isFlagged={this.state.isFlagged.has(index)}
            onCellClick={cell => this.handleLeftClick(cell)}
            onRightClick={cell => this.handleRightClick(cell)}
          />
        );
      }
    }

    return (
      <Game fieldWidth={this.state.field.width}>
        <Panel>
          <Timer mood={this.state.mood} restarted={this.state.restarted} />
          <Mood aria-label="Restart game" onClick={this.restartGame}>{this.state.mood}</Mood>
          <Count flagged={this.state.field.mines - this.state.isFlagged.size} />
        </Panel>
        <Scroll>
          <Wrapper fieldWidth={this.state.field.width}>{this.grid}</Wrapper>
        </Scroll>
        <Difficulty>
          <label>
            Difficulty&nbsp;
            <Select
              aria-label="Game difficulty"
              value={this.state.difficulty}
              onChange={this.handleDifficultyChange}
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </Select>
          </label>
        </Difficulty>
      </Game>
    );
  }
}

export default App;