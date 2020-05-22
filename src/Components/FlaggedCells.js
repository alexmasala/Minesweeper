import React, { Component } from "react";

import styled from "styled-components";

const Cross = styled.span`
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -12.5px;
  margin-top: -12.5px;
`;

const Square = styled.span`
  position: relative;
  width: 40px;
  height: 40px;
  background-color: ${props => {
    if (!props.isFlagged || (props.isFlagged && props.isOpened)) {
      return "#fdfcfd";
    }
    if (props.isFlagged && props.isEven) {
      return "#c8d6e5";
    }
    if (props.isFlagged && !props.isEven) {
      return "#b6c3d1";
    }
  }};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  cursor: default;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  color: ${props => {
    switch (props.value) {
      case 1:
        return "#4169e1;";
      case 2:
        return "#228b22";
      case 3:
        return "#dc143c";
      case 4:
        return "#00008b";
      case 5:
        return "#a0522d";
      case 6:
        return "#ff00ff";
      default:
        return "#000000;";
    }
  }};
  font-weight: 600;
  border: 1px solid
    ${props => (props.isEven || props.isOpened ? "#c8d6e5" : "#b6c3d1")};
  &:before {
    position: absolute;
    top: 0px;
    left: 0px;
    content: "";
    width: ${props => (props.isOpened || props.isFlagged ? "0px" : "40px")};
    height: ${props => (props.isOpened || props.isFlagged ? "0px" : "40px")};
    background-color: ${props => (props.isEven ? "#fcf3d8" : "#f8cb6d")};
  }
  &:hover {
    opacity: ${props => (!props.isOpened ? "0.85" : "")};
  }
`;

class Cell extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleRightClick = this.handleRightClick.bind(this);
    this.handleLongTouch = this.handleLongTouch.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    this.props.onCellClick({
      value: this.props.value,
      index: this.props.index,
      position: this.props.coordinates
    });
  }

  handleRightClick(e) {
    e.preventDefault();
    this.props.onRightClick({
      value: this.props.value,
      index: this.props.index,
      position: this.props.coordinates
    });
  }

  handleLongTouch() {
    this.longPressTimerId = setTimeout(() => {
      this.longPressed = true;
      this.props.onRightClick({
        value: this.props.value,
        index: this.props.index,
        position: this.props.coordinates
      });
    }, 500);
  }

  handleTouchEnd(e) {
    clearTimeout(this.longPressTimerId);
    // to prevent click event, that uncovers the cell
    if (this.longPressed) {
      e.preventDefault();
      this.longPressed = false;
    }
  }

  render() {
    let value;
    this.props.value === 0 ? (value = "") : (value = this.props.value);
    return (
      <Square
        onTouchStart={this.handleLongTouch}
        onTouchEnd={this.handleTouchEnd}
        isEven={this.props.isEven}
        isOpened={this.props.isOpened}
        isFlagged={this.props.isFlagged}
        onContextMenu={this.handleRightClick}
        onClick={this.handleClick}
        value={value}
      >
        {this.props.isFlagged && this.props.isOpened ? (
          <React.Fragment>
            {value}
            {/* eslint-disable jsx-a11y/accessible-emoji */}
            <Cross role="img" aria-label="Cross mark">
              ❌
            </Cross>
          </React.Fragment>
        ) : this.props.isFlagged ? (
          "🚩"
        ) : (
          value
        )}
      </Square>
    );
  }
}

export default Cell;