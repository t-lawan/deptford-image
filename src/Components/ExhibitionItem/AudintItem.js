import * as React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { richTextOptions } from "../../Utility/Richtext";
import VideoPlayer from "../VideoPlayer/VideoPlayer";
import { ResponsiveIFrameWrapper } from "./DefaultExhibitionItem";
import AudintBackground from "../../Assets/AudintBackground.png";
import AudioPlayer from "../AudioPlayer/AudioPlayer";
const AudIntResponsiveIFrameWrapper = styled(ResponsiveIFrameWrapper)`
  text-align: center;
`;

const GridDiv = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 9fr 1fr;
  background: url(${AudintBackground});
  font-family: AudintBody;
  color: #cdc2fe !important;
  width: auto;
  height: 100vh;
`;
const ExhibitionItemWrapper = styled.div`
  padding: 2rem;
  overflow-x: auto;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  align-content: center;
  position: absolute;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const TextWrapper = styled.div`
  padding: 1rem;
  display: inline-block;
  width: 60%;
  height: 60%;
  flex: 0 0 auto;
  text-align: center;
  :first-of-type {
    width: 100%;
  }
  p {
    /* width: 40%; */
    white-space: break-spaces;
  }
`;

const AudioTextWrapper = styled.div`
  margin: 0 2rem;
  color: #cdc2fe !important;
`;

const AudioWrapper = styled.div`
  position: fixed;
  bottom: 0;
  background: transparent;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const AudintTitle = styled.h1`
  font-family: AudintTitle;
  font-weight: 100;
  color: #cdc2fe !important;
`;

const generateSection = (item, index) => {
  let renderComponent = <p> Hello</p>;
  switch (item.sectionType) {
    case "video":
      renderComponent = (
        <TextWrapper key={index}>
          {item.showTitle ? <AudintTitle> {item.title}</AudintTitle> : null}
          <AudIntResponsiveIFrameWrapper>
            <VideoPlayer videoUrl={item.videoUrl} />
          </AudIntResponsiveIFrameWrapper>
        </TextWrapper>
      );
      break;
    case "text":
      renderComponent = (
        <TextWrapper key={index}>
          {item.showTitle ? <AudintTitle> {item.title}</AudintTitle> : null}
          {documentToReactComponents(item.text, richTextOptions)}
        </TextWrapper>
      );
      break;
  }
  return renderComponent;
};

const AudintItem = props => {
  let item = props.item;
  console.log("AUDINT", item.audio);
  return (
    <GridDiv>
      <ExhibitionItemWrapper>
        {item ? (
          <>
            {item.audint_section.map((section, index) =>
              generateSection(section, index)
            )}
          </>
        ) : null}
      </ExhibitionItemWrapper>
      <AudioWrapper>
        <AudioTextWrapper>
          {documentToReactComponents(item.audio.text, richTextOptions)}
        </AudioTextWrapper>
        <AudioPlayer url={item.audio.audio.fields.file.url} />
      </AudioWrapper>
    </GridDiv>
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
