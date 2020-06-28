import * as React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { richTextOptions } from "../../Utility/Richtext";
import VideoPlayer from "../VideoPlayer/VideoPlayer";
import { ResponsiveIFrameWrapper } from "./DefaultExhibitionItem";
import AudintBackground from "../../Assets/AudintBackground.png";
import AudioPlayer from "../AudioPlayer/AudioPlayer";
import { Colour } from "../Global/global.styles";
import { render } from "@testing-library/react";
const AudIntResponsiveIFrameWrapper = styled(ResponsiveIFrameWrapper)`
  text-align: center;
`;

const GridDiv = styled.div`
  overflow-x: auto;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 9fr 2fr;
  background: url(${AudintBackground});
  font-family: AudintBody;
  color: ${Colour.pink} !important;
  width: auto;
  height: 100vh;
`;
const ExhibitionItemWrapper = styled.div`
  /* padding: 2rem; */
  /* overflow-x: auto; */
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  align-content: center;
  overflow-y: hidden;
  /* position: absolute; */
  ::-webkit-scrollbar {
    display: none;
  }
`;

const AudioWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  align-content: center;
  background: transparent;
  overflow-y: hidden;
  overflow-x: hidden;
  width: 100%;
  align-items: center;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const AudioTextWrapper = styled.div`
  margin: 0 2rem;
  flex: 0 0 auto;
  color: ${Colour.pink} !important;
  margin-left: 100%;
`;

const TextWrapper = styled.div`
  padding: 1rem;
  display: flex;
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
    margin: auto;
  }
`;

const IntroTextWrapper = styled.div`
  p {
    /* width: 40%; */
    /* white-space: break-spaces; */
    font-size: 1.15rem !important;
    text-align: right;
  }
`;

const IntroHeadingWrapper = styled.div`
  margin-bottom: 1.5rem;
`;

const VideoWrapper = styled.div`
  /* padding: 1rem; */

  width: 100%;
  display: grid;
  flex: 0 0 auto;
  text-align: center;
  grid-template-columns: ${props => (props.oneColumn ? "1fr" : "3fr 5fr")};
`;



const AudintTitle = styled.h1`
  font-family: AudintTitle;
  font-weight: 100;
  color: ${Colour.pink} !important;
  margin: 0;
`;

const generateSection = (item, index) => {
  let renderComponent = <p> Hello</p>;
  switch (item.sectionType) {
    case "video":
      renderComponent = (
        <VideoWrapper oneColumn={!item.showTitle} key={index}>
          <IntroTextWrapper>
            <IntroHeadingWrapper>
              {item.showTitle ? <AudintTitle> {item.title}</AudintTitle> : null}
              {item.author ? (
                <AudintTitle> {item.author.toLowerCase()}</AudintTitle>
              ) : null}
            </IntroHeadingWrapper>
            {documentToReactComponents(item.text, richTextOptions)}
          </IntroTextWrapper>

          <AudIntResponsiveIFrameWrapper>
            <VideoPlayer videoUrl={item.videoUrl} />
          </AudIntResponsiveIFrameWrapper>
        </VideoWrapper>
      );
      break;
    case "text":
      renderComponent = (
        <TextWrapper key={index}>
          {item.showTitle ? (
            <AudintTitle> {item.title.toLowerCase()}</AudintTitle>
          ) : null}
          {documentToReactComponents(item.text, richTextOptions)}
        </TextWrapper>
      );
      break;
  }
  return renderComponent;
};

class AudintItem extends React.Component {
  topRowRef;
  bottomRowRef;

  constructor(props) {
    super(props);
    this.topRowRef = React.createRef()
    this.bottomRowRef = React.createRef()
  }
  onTopRowScroll = () => {
    let topScrollWidth = this.topRowRef.current.scrollWidth - this.topRowRef.current.offsetWidth;
    let topScrollLeft = this.topRowRef.current.scrollLeft
    let topRowPercentScroll = topScrollLeft/topScrollWidth;
    // console.log('PERCENTAGE', topRowPercentScroll)
    this.bottomRowRef.current.scrollLeft = topRowPercentScroll * (this.bottomRowRef.current.scrollWidth - this.bottomRowRef.current.offsetWidth)
    // console.log('scrollWidth', this.bottomRowRef.current.scrollWidth)
    // console.log('offsetWidth', this.bottomRowRef.current.offsetWidth)
    console.log('scrollLeft', this.bottomRowRef.current.scrollLeft)
    
  }
  render() {
    this.item = this.props.item;
    console.log("AUDINT", this.item);
    return (
      <GridDiv>
        <ExhibitionItemWrapper ref={this.topRowRef} onScroll={this.onTopRowScroll}>
          {this.item ? (
            <>
              {this.item.audint_section.map((section, index) =>
                generateSection(section, index)
              )}
            </>
          ) : null}
        </ExhibitionItemWrapper>
        <AudioWrapper ref={this.bottomRowRef}>
          <AudioTextWrapper>
            {documentToReactComponents(this.item.audio.text,richTextOptions)}
          </AudioTextWrapper>
          <AudioPlayer url={this.item.audio.audio.fields.file.url} />
        </AudioWrapper>
      </GridDiv>
    );
  }
}

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
