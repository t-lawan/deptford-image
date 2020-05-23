import * as React from "react";
import styled from "styled-components";
import { connect } from "react-redux";

const LoadingWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1000;
  margin: auto;
  /* width: 60%; */
  background: #72869d;
  display: ${props => (props.show ? "block" : "none")};
  text-align: center;
`;
const Loading = props => {
  return (
    <LoadingWrapper show={!props.has_loaded}>
      <h2> Deptford Moving Image Festival</h2>
      <p> Loading...</p>
    </LoadingWrapper>
  );
};

const mapStateToProps = (state) => {
  return {
    has_loaded: state.has_loaded
  };
};

export default connect(
  mapStateToProps,
  null
)(Loading);
