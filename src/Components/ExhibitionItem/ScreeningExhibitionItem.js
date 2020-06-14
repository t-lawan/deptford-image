import * as React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import VideoPlayer from "../VideoPlayer/VideoPlayer";
import { Colour, size } from "../Global/global.styles";
import { ResponsiveIFrameWrapper } from "./DefaultExhibitionItem";

const ExhibitionItemWrapper = styled.div`
  padding: 1rem;
  @media (max-width: ${size.tabletL}) {
    padding: 0.25rem;
  }
`;

const ScreeningExhibitionItem = props => {
  let item = props.item;
  return (
    <ExhibitionItemWrapper>
      {item ? (
        <div>
          {/* <h2>
            {" "}
            {item.title}, {item.participant}{" "}
          </h2> */}
          <ResponsiveIFrameWrapper>
            <VideoPlayer
              withBorder
              posterUrl={item.poster_url}
              videoUrl={item.video_url}
            />
          </ResponsiveIFrameWrapper>
        </div>
      ) : null}
    </ExhibitionItemWrapper>
  );
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
)(ScreeningExhibitionItem);
