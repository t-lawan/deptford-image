import * as React from "react";
import styled from "styled-components";
import { connect } from "react-redux";

const InstructionWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1000;
  background: transparent;
  display: ${props => (props.show ? "block" : "none")};
  text-align: center;
  opacity: ${props => (props.show ? 1 : 0)};
  transition: opacity ease-out 1s;
`;

const Instructions = styled.div`
  position: sticky;
  top: 75%;
  text-align: center;

`;
class Instruction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true
    };
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.has_loaded !== this.props.has_loaded &&
      this.props.has_loaded
    ) {
        setTimeout(() => {
          this.setState({
            show: false
          });
        }, 5000);
    }
  }

  render() {
    return (
      <InstructionWrapper show={this.props.has_loaded && this.state.show}>
        <Instructions>
          <p> Click Drag or Touch to turn the view </p>
          <p> Use the arrows buttons to move </p>
        </Instructions>
      </InstructionWrapper>
    );
  }
}

const mapStateToProps = state => {
  return {
    has_loaded: state.has_loaded
  };
};

export default connect(
  mapStateToProps,
  null
)(Instruction);
