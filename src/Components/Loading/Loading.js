import * as React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import LoadingBar from "./LoadingBar";
import LoadingIcon from "./LoadingIcon";
import { Colour } from "../Global/global.styles";

const LoadingWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1000;
  /* margin: auto; */
  /* width: 60%; */
  background: ${Colour.grey};
  display: ${props => (props.show ? "flex" : "none")};
  /* text-align: center; */
  /* display: flex; */
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  align-content: space-between;
`;
const TextWrapper = styled.div`
  text-align: center;
`

const LoadingText = styled.p`
  color: ${Colour.green}

`
const LoadingTitle = styled.h1`
  color: white;
  z-index: 1000;
  font-size: 3rem;
  font-family: 'FreightBigLight', sans-serif;

`;
//
const Loading = props => {
  return (
    <LoadingWrapper show={!props.has_loaded}>
      <LoadingIcon />
      <TextWrapper>
        <LoadingTitle> CONTAGION</LoadingTitle>
        <LoadingText> Loading </LoadingText>

      </TextWrapper>
      <LoadingIcon />
    </LoadingWrapper>
  );
};

const mapStateToProps = state => {
  return {
    has_loaded: state.has_loaded
  };
};

export default connect(
  mapStateToProps,
  null
)(Loading);
