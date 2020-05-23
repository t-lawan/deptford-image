import * as React from "react";
import styled from "styled-components";
import { connect } from "react-redux";

const LoadingBarWrapper = styled.div`
    bottom: 0;
    width: 100%;
    height: 1rem;
    background: #72869d;
    position: absolute;
`;

const LoadingProgressWrapper = styled.div`
    bottom: 0;
    width: ${props => props.percent};
    height: 100%;
    background: green;
`;
const LoadingBar = props => {

    let percent = Math.round((props.loaded/props.total) * 100);
  return (
    <LoadingBarWrapper>
        <LoadingProgressWrapper percent={`${percent}%`} />
    </LoadingBarWrapper>
  );
};

const mapStateToProps = (state) => {
  return {
    loaded: state.loaded,
    total: state.total
  };
};

export default connect(
  mapStateToProps,
  null
)(LoadingBar);
