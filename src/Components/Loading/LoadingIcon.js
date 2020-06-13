import * as React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import TransparentStar from "../../Assets/TransparentStar.png";
const LoadingIconWrapper = styled.div`
    width: 5%;
`;

const LoadingIconImage = styled.img`
  background: ${props => `rgb(0,${props.value}, 0)`};

`;

const LoadingIcon = props => {
  let percent = 0;

  if (props.loaded && props.total) {
    percent = Math.round(props.loaded / props.total);
  }
  let gValue = percent * 255;
  return (
    <LoadingIconWrapper>
      <LoadingIconImage src={TransparentStar} value={gValue} />
    </LoadingIconWrapper>
  );
};

const mapStateToProps = state => {
  return {
    loaded: state.loaded,
    total: state.total
  };
};

export default connect(
  mapStateToProps,
  null
)(LoadingIcon);
