import * as React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { showInstructions } from "../../Store/action";

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
    // if (
    //   prevProps.has_loaded !== this.props.has_loaded &&
    //   this.props.has_loaded
    // ) {
    //   this.props.showInstructions()
    //   console.log('HELLO', this.props)

    //     // setTimeout(() => {
    //     //   this.setState({
    //     //     show: false
    //     //   });
    //     // }, 5000);
    // }
  }

  render() {
    return (
      <InstructionWrapper show={this.props.has_loaded && this.props.show_instructions}>
        <Instructions>
          <p> Click, Drag or Touch to turn the view </p>
          <p> Use the arrows buttons to move </p>
          <p> Use the WASD buttons to move within the space </p>
          <p> click and drag the mouse OR use the arrow buttons to turn </p>
          <p> double click on an object to open modal </p>
        </Instructions>
      </InstructionWrapper>
    );
  }
}

const mapStateToProps = state => {
  return {
    has_loaded: state.has_loaded,
    show_instructions: state.show_instructions
  };
};

const mapDispatchToProps = dispatch => {
  return {
    showInstructions: () => dispatch(showInstructions())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Instruction);
