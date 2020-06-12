import * as React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { richTextOptions } from "../../Utility/Richtext";
import VideoPlayer from "../VideoPlayer/VideoPlayer";
import {ResponsiveIFrameWrapper} from './DefaultExhibitionItem';
import AudintBackground from '../../Assets/AudintBackground.png'
const ExhibitionItemWrapper = styled.div`
  background: url(${AudintBackground});
  font-family: AudintBody;
  color: #CDC2FE;
  width: 100%;
  /* background: pink; */
`;

const AudintTitle = styled.h1`
  font-family: AudintTitle;
`

const AudintItem = props => {
  let item = props.item;
  return (
    <ExhibitionItemWrapper>
      {item ? (
        <div>
          <AudintTitle>
            {" "}
            {item.title}, {item.participant}{" "}
          </AudintTitle>
          <p>{item.description}</p>
          <ResponsiveIFrameWrapper>
            <VideoPlayer
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
    pages: state.pages,
    modal_item: state.modal_item
  };
};

export default connect(
  mapStateToProps,
  null
)(AudintItem);
