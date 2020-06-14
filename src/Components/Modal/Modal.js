import * as React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { closeModal } from "../../Store/action";
import CloseOverlaySVG from "../../Assets/close_overlay.svg";
import CloseIcon from "../../Assets/CloseIcon.png";
import ExhibitionItem from "../ExhibitionItem/ExhibitionItem";
import { size } from "../Global/global.styles";
import Page from "../Page/Page";
import { ModelTypes } from "../../Utility/ObjectExhibitionMap";

const ModalWrapper = styled.div`
  position: absolute;
  width: 100%;
  min-height: 100%;
  z-index: 500;
  background: rgba(255,255,255, 0.6);
  
  display: ${props => (props.show ? "block" : "none")};
  /* text-align: center; */
`;

const ModalHeader = styled.div`
  /* padding: 0.5em 0.25em; */
  padding-bottom: 0;
  text-align: right;
  position: fixed;
  width: 100%;
  z-index: 550;
  padding: 1rem;

`;

const ModalBody = styled.div`
  /* padding: 2em; */
  padding-bottom: 0;
  /* width: 100%;
  display: flex;
  position: fixed;
  justify-content: center;
  align-items: center;
  align-content: center;
  flex-direction: column; */
`;
export const ModalCloseImage = styled.img`
  width: 7.5%;
  align-self: flex-end;
  @media (max-width: ${size.tabletL}) {
    width: 10%;
  }
`;

class Modal extends React.Component {
  closeModal = () => {
    this.props.closeModal();
  };
  render() {

    return (
      <ModalWrapper show={this.props.open}>
        <ModalHeader>
          <ModalCloseImage
            onClick={() => this.closeModal()}
            src={CloseIcon}
          />
        </ModalHeader>
        <ModalBody>
          {this.props.type ===  ModelTypes.EXHIBIITION_ITEM ? <ExhibitionItem /> : null}  
          {this.props.type === ModelTypes.PAGE ?  <Page /> : null}
        </ModalBody>
      </ModalWrapper>
    );
  }
}

const mapStateToProps = state => {
  return {
    open: state.modal_open,
    component: state.component,
    type: state.modal_type
  };
};

const mapDispatchToProps = dispatch => {
  return {
    closeModal: () => dispatch(closeModal())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Modal);
