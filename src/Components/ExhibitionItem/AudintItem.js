import * as React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { richTextOptions } from "../../Utility/Richtext";

const PageWrapper = styled.div`
  /* background: green; */
`;

const TextWrapper = styled.div`
  text-align: left;

`

const AudintItem = props => {
  let item = props.item;
  return (
    <PageWrapper>
      {item ? (
        <>
          <h1> {item.title}</h1>
          {/* <TextWrapper> {documentToReactComponents(item.text, richTextOptions)} </TextWrapper> */}
        </>
      ) : null}
    </PageWrapper>
  );
};

const mapStateToProps = state => {
  return {
    pages: state.pages,
    modal_item: state.modal_item
  };
};

export default connect(
  mapStateToProps,
  null
)(AudintItem);
