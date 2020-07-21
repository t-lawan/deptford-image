import * as React from "react";
import Layout from "../../Components/Layout/Layout";
import { connect } from "react-redux";
import styled from "styled-components";
import { Link } from 'react-router-dom';
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { richTextOptions } from "../../Utility/Richtext";
import { PageTitle } from "../../Components/Page/AboutPage";
import { Colour } from "../../Components/Global/global.styles";
import RequestManager from "../../Utility/RequestManager";
import { setPages } from "../../Store/action";
import DataPrivacyPageComp from "../../Components/Page/DataPrivacyPageComp";

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
    display: ${props => (props.show ? "flex" : "none")};
`
const DataPrivacyPage = (props) => {

  const page = props.pages.find((pg) => {
    return pg.id === "2nWP2pkgns6CaUAWF6rykz"
  })

  return (
    <Layout>
      <DataPrivacyPageComp />
    </Layout>
  );
};

const mapStateToProps = state => {
  return {
    pages: state.pages,
    show_instructions: state.show_instructions,
    has_loaded: state.has_loaded,

  };
};
const mapDispatchToProps = dispatch => {
  return {
    setPages: pages => dispatch(setPages(pages)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DataPrivacyPage);
