import * as React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { closeModal } from "../../Store/action";
import CloseOverlaySVG from '../../Assets/close_overlay.svg'
const ModalWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 500;
  background: white;
  display: ${props => (props.show ? "block" : "none")};
  text-align: center;
`;

const ModalHeader = styled.div`
  padding: 0.5em 0;
  padding-bottom: 0;
  text-align: right;
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
        <h2> This is a video about art</h2>
        <p>
          {" "}
          Portland polaroid duis quinoa, proident food truck skateboard pickled
          pok pok pop-up. Selvage pour-over deep v normcore. Bicycle rights
          direct trade leggings ea mollit. Cardigan leggings PBR&B beard,
          officia skateboard direct trade. Jianbing meh sriracha irure, PBR&B
          iPhone distillery est dolore. Cornhole drinking vinegar jean shorts,
          ex labore messenger bag cronut echo park hella sint fam.
        </p>
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
