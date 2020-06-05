import * as React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import VideoPlayer from "../VideoPlayer/VideoPlayer";

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

  return (
    <ExhibitionItemWrapper>
      {item ? <div>
        <h2> {item.title} </h2>
        <p> 
            {item.description}
        </p>
        <ResponsiveIFrameWrapper>
          <VideoPlayer posterUrl={item.poster_url} videoUrl={item.video_url}/>
          {/* <Vimeo video={item.vimeo_id} responsive={true} /> */}
        </ResponsiveIFrameWrapper>
      </div> :  null}
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
)(ExhibitionItem);
