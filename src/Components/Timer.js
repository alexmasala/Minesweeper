import React, { Component } from "react";
import styled from "styled-components";

const Clock = styled.span``;

class Timer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: 0
    };
  }

  componentDidMount() {
    this.timerID = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  componentDidUpdate(prevProps) {
    if (this.props.restarted !== prevProps.restarted) {
      clearInterval(this.timerID);
      this.setState({ time: 0 });
      this.timerID = setInterval(() => this.tick(), 1000);
    }
  }

  tick() {
    this.setState(state => {
      return { time: state.time + 1 };
    });
  }

  render() {
    if (this.props.mood !== "🙂") clearInterval(this.timerID);
    return <Clock>{this.state.time.toString().padStart(3, "0")}</Clock>;
  }
}

export default Timer;