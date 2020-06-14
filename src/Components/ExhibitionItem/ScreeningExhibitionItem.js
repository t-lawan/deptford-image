import * as React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import VideoPlayer from "../VideoPlayer/VideoPlayer";
import { Colour } from "../Global/global.styles";

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
