import * as React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { closeModal } from "../../Store/action";
import CloseOverlaySVG from "../../Assets/close_overlay.svg";
import ExhibitionItem from "../ExhibitionItem/ExhibitionItem";
const ModalWrapper = styled.div`
  position: absolute;
  width: 100%;
  max-height: 100%;
  height: 100%;
  z-index: 500;
  background: white;
  display: ${props => (props.show ? "block" : "none")};
  text-align: center;
`;

const ModalHeader = styled.div`
  padding: 0.5em 0.25em;
  padding-bottom: 0;
  text-align: right;
`;

const ModalBody = styled.div`
  padding: 0.5em 0;
  padding-bottom: 0;
`;
export const ModalCloseImage = styled.img`
  width: 5%;
  align-self: flex-end;
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
            src={CloseOverlaySVG}
          />
        </ModalHeader>
        <ModalBody>
            <ExhibitionItem />
        </ModalBody>
      </ModalWrapper>
    );
  }
}

const mapStateToProps = state => {
  return {
    open: state.modal_open,
    component: state.component
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
