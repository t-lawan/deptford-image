import * as React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { showInstructions } from "../../Store/action";
import ImageIcon from "../../Assets/info.png";
import { Colour, size } from "../Global/global.styles";
import Device from "../../Utility/Device";
const InstructionWrapper = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 1100;
  background: transparent;
  display: ${props => (props.show ? "flex" : "none")};
  /* text-align: center; */
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  align-content: space-between;
`;

const Instructions = styled.div`
  /* position: sticky; */
  /* top: 75%; */
  text-align: center;
  color: black;
`;

const TextWrapper = styled.div`
  padding: 1rem;
`;

const InstructionText = styled.p`
  margin-bottom: 0.5rem;
  @media (max-width: ${size.tabletL}) {
    margin: 0;
    margin-bottom: 0.25rem;
    padding: 0;
    font-size: 0.9rem !important;
  }
`;
const ImageWrapper = styled.div`
  /* float: right; */
  /* padding: 1rem; */
  display: ${props => (props.show ? "block" : "none")};
  /* text-align: right; */
`;

const InstructionInfoImage = styled.img`
  width: 5%;
`;

const CloseText = styled.p`
  text-decoration: underline;
  :hover {
    font-style: italic;
  }
`;
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
    });
  };

  hideText = () => {
    this.setState({
      show: false
    });
  };

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
      <InstructionWrapper show={this.props.show_instructions}>
        <Instructions>
          {/* <ImageWrapper show={!this.state.show} onClick={() => this.showText()}>
            <InstructionInfoImage src={ImageIcon} />
          </ImageWrapper> */}
          <TextWrapper>
            {!Device.isMobile() ? (
              <>
                <InstructionText>
                  {" "}
                  Use the arrow or WASD keys to move{" "}
                </InstructionText>
                <InstructionText>
                  {" "}
                  Click and Drag to turn the view{" "}
                </InstructionText>
                <InstructionText>
                  {" "}
                  Use the Q and E keys to rotate{" "}
                </InstructionText>
                <InstructionText>
                  {" "}
                  Double click on an object attached to the green box to view
                  content{" "}
                </InstructionText>
              </>
            ) : (
              <>
                <InstructionText>
                  {" "}
                  Pinch and Spread with two fingers to zoom
                </InstructionText>
                <InstructionText>  Press and drag with one finger to rotate </InstructionText>
                <InstructionText>
                  {" "}
                  Tap on an object attached to the green box to view content
                </InstructionText>
                <InstructionText>
                  {" "}
                  Recommended to be viewed on desktop
                </InstructionText>
                <InstructionText>
                  {" "}
                  Tap to start
                </InstructionText>
              </>
            )}
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
