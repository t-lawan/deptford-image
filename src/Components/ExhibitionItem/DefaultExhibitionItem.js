import * as React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import ReaderExhibitionItem from "./ReaderExhibitionItem";
import ScreeningExhibitionItem from "./ScreeningExhibitionItem";

const ExhibitionItemWrapper = styled.div`
  padding: 1rem;
`;

export const ResponsiveIFrameWrapper = styled.div`
  padding: 2rem;
  width: 80%;
  margin: auto;

  /* padding: 56.25% 0 0 0;
  position: relative; */
`;
const DefaultExhibitionItem = props => {
  let item = props.item;

  let renderedComponent = <p></p>;
  if (item) {
    console.log('ITEM', item.type)
    switch (item.type) {
      case "screening":
        renderedComponent = <ScreeningExhibitionItem item={item} />;
        break;
      case "reader":
        renderedComponent = <ReaderExhibitionItem item={item} />;
        break;  
      default:
        renderedComponent = <ScreeningExhibitionItem item={item} />;
        break;
    }
  }
  return renderedComponent;
};

const mapStateToProps = state => {
  return {
    exhibition_items: state.exhibition_items,
    modal_item: state.modal_item
  };
};

export default connect(
  mapStateToProps,
  null
)(DefaultExhibitionItem);
