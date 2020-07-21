import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { hasAgreedToTerms } from "../../Store/action";
import { Colour } from "../Global/global.styles";
import ReactGA from "react-ga";
import { Link } from 'react-router-dom';

const DataPrivacyWrapper = styled.div`
    background: ${Colour.green};
    opacity: 0.6;
    display: ${props => (props.show ? "flex" : "none")};
    flex-direction: row;
    padding: 0.5rem 1rem;
    width: 100%;
    height: 10vh;
    z-index: 1200;
    bottom: 0;
    left: 0%;
    position: fixed;
    justify-content: space-around;
`;

const DataPrivacyText = styled.p`
    /* display: inline-flex; */
`

const TextWrapper = styled.div`
  width: 80%;
`

const DataPrivacyButton = styled(DataPrivacyText)`
  :hover {
    color: white;
  }
`
class DataPrivacy extends React.Component {
  componentDidMount() {
    if (typeof window !== `undefined`) {
      if (window.sessionStorage.getItem("AGREED_TO_PRIVACY")) {
        if (!this.props.has_agreed_to_terms) {
          this.props.hasAgreedToTerms();
          this.initializeReactGA();
        }
      }
    }
  }

  initializeReactGA = () => {
    ReactGA.initialize("UA-153315241-2");
    ReactGA.pageview("/");
  };

  setAgreedToTrue = () => {
    if (!this.props.has_agreed_to_terms) {
      this.props.hasAgreedToTerms();
      if (typeof window !== `undefined`) {
        if (!window.sessionStorage.getItem("AGREED_TO_PRIVACY")) {
          window.sessionStorage.setItem("AGREED_TO_PRIVACY", true);

          this.initializeReactGA();
        }
      }
    }
  };

  render() {
    return (
      <DataPrivacyWrapper show={!this.props.has_agreed_to_terms && !this.props.show_instructions}>
      <TextWrapper>
        <DataPrivacyText> By using this website you agree to the use of cookies in accordance with our <Link to={'/privacy-policy'}>data privacy policy</Link>. </DataPrivacyText>
      </TextWrapper>
        <DataPrivacyButton onClick={() => this.setAgreedToTrue()}> Okay</DataPrivacyButton>
      </DataPrivacyWrapper>
    );
  }
}

const mapStateToProps = state => {
  return {
    has_agreed_to_terms: state.has_agreed_to_terms,
    show_instructions: state.show_instructions
  };
};

const mapDispatchToProps = dispatch => {
  return {
    hasAgreedToTerms: () => dispatch(hasAgreedToTerms())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DataPrivacy);
