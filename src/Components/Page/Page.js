import * as React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { richTextOptions } from "../../Utility/Richtext";
import { Colour } from "../Global/global.styles";

const PageWrapper = styled.div`
  padding: 1rem;
  width: 60%;
`;

const TextWrapper = styled.div`
  text-align: left;
`

const PageTitle =  styled.h1`
  padding-bottom: 2rem;
  color: ${Colour.green};
  border-bottom: 1px solid ${Colour.green};
`

const Page = props => {
  let item = props.pages.find(it => {
    return it.id === props.modal_item;
  });
  return (
    <PageWrapper>
      {item ? (
        <>
          <PageTitle> {item.title}</PageTitle>
          <TextWrapper> {documentToReactComponents(item.text, richTextOptions)} </TextWrapper>
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
)(Page);
