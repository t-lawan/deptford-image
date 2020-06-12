import * as React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import VideoPlayer from "../VideoPlayer/VideoPlayer";
import AudintItem from "./AudintItem";
import DefaultExhibitionItem from "./DefaultExhibitionItem";
const ExhibitionItemWrapper = styled.div``;

export const ResponsiveIFrameWrapper = styled.div`
  padding: 1rem;
  /* padding: 56.25% 0 0 0;
  position: relative; */
`;
const ExhibitionItem = props => {
  let item = props.exhibition_items.find(it => {
    return it.id === props.modal_item;
  });

  let renderedComponent = <p></p>;
  if (item) {
    switch (item.map_id) {
      case "protocols_audint":
        renderedComponent = <AudintItem item={item} />;
        break;
      default:
        renderedComponent = <DefaultExhibitionItem item={item} />;
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
)(ExhibitionItem);
