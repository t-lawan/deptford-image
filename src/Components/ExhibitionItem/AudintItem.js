import * as React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { richTextOptions } from "../../Utility/Richtext";
import VideoPlayer from "../VideoPlayer/VideoPlayer";
import { ResponsiveIFrameWrapper } from "./DefaultExhibitionItem";
import AudintBackground from "../../Assets/AudintBackground.png";

const AudIntResponsiveIFrameWrapper = styled(ResponsiveIFrameWrapper)`
  width: 60%;
  text-align: center;
`
const ExhibitionItemWrapper = styled.div`
  background: url(${AudintBackground});
  font-family: AudintBody;
  color: #cdc2fe !important;
  width: 100%;
  padding: 2rem;
  /* background: pink; */
`;

const TextWrapper = styled.div`
  padding: 1rem;
`

const AudioWrapper = styled(TextWrapper)``

const AudintTitle = styled.h1`
  font-family: AudintTitle;
  font-weight: 100;
  color: #cdc2fe !important;
`;

const generateSection = item => {
  let renderComponent = <p> Hello</p>;
  switch (item.sectionType) {
    case "video":
      renderComponent = (
        <TextWrapper>
          {item.showTitle ? <AudintTitle> {item.title}</AudintTitle> : null}
          <AudIntResponsiveIFrameWrapper>
            <VideoPlayer
              videoUrl={item.videoUrl}
            />
          </AudIntResponsiveIFrameWrapper>
        </TextWrapper>
      );
      break;
    case "text":
      renderComponent = (
        <TextWrapper>
          {item.showTitle ? <AudintTitle> {item.title}</AudintTitle> : null}
          {documentToReactComponents(item.text, richTextOptions)}
        </TextWrapper>
      );
      break;
    case "audio":
      renderComponent = (
        <AudioWrapper>
          {item.showTitle ? <AudintTitle> {item.title}</AudintTitle> : null}
          <p> AUDIO</p>
        </AudioWrapper>
      );
      break;
  }
  return renderComponent;
};

const AudintItem = props => {
  let item = props.item;
  console.log("AUDINT", item);
  return (
    <ExhibitionItemWrapper>
      {item ? (
        <div>
          {item.audint_section.map((section, index) =>
            generateSection(section)
          )}
        </div>
      ) : /* <div>
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
        </div> */
      null}
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
