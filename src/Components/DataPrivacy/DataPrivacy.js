import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { hasAgreedToTerms } from "../../Store/action";
import { Colour } from "../Global/global.styles";
import ReactGA from "react-ga";


const DataPrivacyWrapper = styled.div`
    background: ${Colour.green};
`
class DataPrivacy extends React.Component {
  componentDidMount() {
    if (typeof window !== `undefined`) {
      if (window.sessionStorage.getItem("AGREED_TO_PRIVACY")) {
        if (!this.props.has_agreed_to_terms) {
          this.props.hasAgreedToTerms();
        }
      }
    }
  }

 initializeReactGA = () => {
    ReactGA.initialize("UA-153315241-2");
    ReactGA.pageview("/");
  }

  setAgreedToTrue = () => {
    if (!this.props.has_agreed_to_terms) {
      this.props.hasAgreedToTerms();
      if (typeof window !== `undefined`) {
        if (!window.sessionStorage.getItem("AGREED_TO_PRIVACY")) {
          window.sessionStorage.setItem("AGREED_TO_PRIVACY", true);
        }
      }
    }
  };

  render() {
      <DataPrivacyWrapper>

      </DataPrivacyWrapper>
  }
}

const mapStateToProps = state => {
    return {
      has_agreed_to_terms: state.agreed_to_terms,
    }
  }
  
  const mapDispatchToProps = dispatch => {
    return {
        hasAgreedToTerms: () => dispatch(hasAgreedToTerms()),
    }
  }
  
  
  export default connect(mapStateToProps, mapDispatchToProps)(DataPrivacy)
  
