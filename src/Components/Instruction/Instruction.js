import * as React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { showInstructions } from "../../Store/action";
import ImageIcon from "../../Assets/info.png";
import { Colour } from "../Global/global.styles";
const InstructionWrapper = styled.div`
  position: fixed;
  width: 100%;
  /* height: 100%; */
  /* z-index: 1000; */
  background: transparent;
  display: ${props => (props.show ? "block" : "none")};
  text-align: center;
  opacity: ${props => (props.show ? 1 : 0)};
  transition: opacity ease-out 1s;
  bottom: 0;
`;

const Instructions = styled.div`
  /* position: sticky; */
  /* top: 75%; */
  text-align: center;
  color: ${Colour.green};
`;

const TextWrapper = styled.div`
  float: right;
  padding: 1rem;
  display: ${props => (props.show ? "block" : "none")};
`;

const ImageWrapper = styled.div`
  float: right;
  /* padding: 1rem; */
  display: ${props => (props.show ? "block" : "none")};
  text-align: right;
`;

const InstructionInfoImage = styled.img`
  width: 5%;
`;

const CloseText = styled.p`
  text-decoration: underline;
  :hover {
    font-style: italic; 
  }
`
class Instruction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true
    };
  }

  showText = () => {
    this.setState({
      show: true
    })
  }


  hideText = () => {
    this.setState({
      show: false
    })
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
      <InstructionWrapper show={this.props.has_loaded}>
        <Instructions>
          <ImageWrapper show={!this.state.show} onClick={() => this.showText()}>
            <InstructionInfoImage src={ImageIcon} />
          </ImageWrapper>

          <TextWrapper show={this.state.show} onClick={() => this.hideText()}>
            <p> Click and Drag or Touch to turn the view </p>
            <p> Use the arrows buttons or WASD keys to move </p>
            <p> Use the Q and E keys to rotate </p>
            <p> Double click on an object to open modal </p>
            <CloseText onClick={() => this.hideText()}> click here to close </CloseText>
          </TextWrapper>
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
