import React from "react";
import styled from "styled-components";

const Digits = styled.span``;

function count(props) {
  return (
    <Digits>
      {props.flagged >= 0
        ? props.flagged.toString().padStart(3, "0")
        : props.flagged.toString().padStart(3, " ")}
    </Digits>
  );
}

export default count;