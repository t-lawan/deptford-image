import * as React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { richTextOptions } from "../../Utility/Richtext";
import { Colour } from "../Global/global.styles";
import { setPages, hideInstructions } from "../../Store/action";
import { PageTitle } from "./AboutPage";
import { Link } from 'react-router-dom';
import RequestManager from "../../Utility/RequestManager";

const PageWrapper = styled.div`
  padding: 1rem;
  margin-bottom: 5rem;
  h1, h2 {
    margin-top: 2rem;
  }
`
const ReturnHomeWrapper = styled.div`
    background: ${Colour.green};
    opacity: 0.6;
    flex-direction: row;
    padding: 0.5rem 1rem;
    width: 100%;
    height: 10vh;
    z-index: 1200;
    bottom: 0;
    left: 0%;
    position: fixed;
    justify-content: space-around;
    display: flex;
    /* display: ${props => (props.show ? "flex" : "none")}; */
`

class DataPrivacyPageComp extends React.Component {
    async componentDidMount() {
        if(this.props.pages) {
            let pages =  await RequestManager.getPages();
            this.props.setPages(pages);
            this.props.hideInstructions()
          }
    }
  render() {
    let page = this.props.pages.find((pg) => {
        return pg.id === "2nWP2pkgns6CaUAWF6rykz"
      })
    return (
      <>
        <PageWrapper>
          <PageTitle> Data Privacy</PageTitle>
          {page ? documentToReactComponents(page.text, richTextOptions) : null}
        </PageWrapper>
        <ReturnHomeWrapper>
          <p>
            {" "}
            <Link to={"/"}>Return to Homepage</Link>
          </p>
        </ReturnHomeWrapper>
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    pages: state.pages,
    show_instructions: state.show_instructions,
    has_loaded: state.has_loaded
  };
};
const mapDispatchToProps = dispatch => {
  return {
    setPages: pages => dispatch(setPages(pages)),
    hideInstructions : () => dispatch(hideInstructions())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DataPrivacyPageComp);
