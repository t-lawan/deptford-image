import * as React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { richTextOptions } from "../../Utility/Richtext";
import VideoPlayer from "../VideoPlayer/VideoPlayer";
import { ResponsiveIFrameWrapper } from "./DefaultExhibitionItem";
import AudintBackground from "../../Assets/AudintBackground.png";
import AudioPlayer from "../AudioPlayer/AudioPlayer";
import { Colour, size } from "../Global/global.styles";

const AudIntResponsiveIFrameWrapper = styled(ResponsiveIFrameWrapper)`
  text-align: center;
  padding: ${props => (props.fullScreen ? "0" : "2rem")};
  width: ${props => (props.fullScreen ? "100%" : "80%")};
  /* padding-right: ${props => (props.fullScreen ? "2rem" : "")}; */
`;

const GridDiv = styled.div`
  /* overflow-x: auto; */
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 9fr 2fr;
  background: url(${AudintBackground});
  font-family: AudintBody;
  color: ${Colour.pink} !important;
  width: auto;
  height: 100vh;
  flex: 0 0 auto;
`;
const AudintWrapper = styled.div`
  display: flex;
  flex-direction: row;
  /* flex-wrap: nowrap; */
  /* justify-content: space-between; */
  /* overflow-x: scroll; */
  /* overflow-y: hidden; */
  align-items: center;
  align-content: center;
  
`;

const ExhibitionItemWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  align-content: center;
  /* overflow-y: hidden; */
  scrollbar-width: 0;
  /* position: absolute; */
  ::-webkit-scrollbar {
    display: none;
  }
`;

const AudioWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  /* justify-content: space-between;
  align-items: center;
  align-content: center; */
  background: transparent;
  overflow-y: hidden;
  overflow-x: hidden;
  width: 100%;
  align-items: center;
  scrollbar-width: 0;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const AudioTextWrapper = styled.div`
  margin: 0 2rem;
  /* flex: 0 0 auto; */
  color: ${Colour.pink} !important;
  margin-left: 2%;
  flex-wrap: nowrap;
`;



const TextWrapper = styled.div`
  padding: 1rem;
  display: flex;
  width: 100vw;
  height: 60%;
  /* flex: 0 0 auto; */
  text-align: center;
  /* :first-of-type {
    width: 100%;
  } */
  p {
    /* width: 40%; */
    white-space: break-spaces;
    margin: auto;
  }

  @media (max-width: ${size.tabletL}) {
    p {
      font-size: 0.9rem !important;
    }
  }
`;

const IntroTextWrapper = styled.div`
  p {
    /* width: 40%; */
    /* white-space: break-spaces; */
    font-size: 1.15rem !important;
    @media (max-width: ${size.tabletL}) {
      font-size: 0.7rem !important;
    }
    text-align: right;
  }
`;

const IntroHeadingWrapper = styled.div`
  margin-bottom: 1.5rem;
`;

const VideoWrapper = styled.div`
  padding: ${props => (props.oneColumn ? "0" : "0 1rem")};
  width: ${props => (props.oneColumn ? '100%' : '100vw')};

  display: grid;
  /* flex: 0 0 auto; */
  text-align: center;
  grid-template-columns: ${props => (props.oneColumn ? "1fr" : "3fr 5fr")};
`;

const AudintTitle = styled.h1`
  font-family: AudintTitle;
  font-weight: 100;
  color: ${Colour.pink} !important;
  margin: 0;
  @media (max-width: ${size.tabletL}) {
    font-size: 0.9rem !important;
  }
`;

const OpeningDiv = styled.div`
  width: auto;
  height: 100vh;
  width: 100vw;
  /* display: grid; */
  background: black;
  flex: 0 0 auto;
`

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

          <AudIntResponsiveIFrameWrapper fullScreen={!item.text}>
            <VideoPlayer
              autoPlay={index === 10}
              fullScreen={!item.text}
              videoUrl={item.videoUrl}
            />
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

  if(index === 0) {
    renderComponent = (<></>)
  }
  return renderComponent;
};

class AudintItem extends React.Component {
  topRowRef;
  bottomRowRef;

  constructor(props) {
    super(props);
    this.topRowRef = React.createRef();
    this.bottomRowRef = React.createRef();
  }
  onTopRowScroll = () => {
    let topScrollWidth =
      this.topRowRef.current.scrollWidth - this.topRowRef.current.offsetWidth;
    let topScrollLeft = this.topRowRef.current.scrollLeft;
    let topRowPercentScroll = topScrollLeft / topScrollWidth;
    this.bottomRowRef.current.scrollLeft =
      topRowPercentScroll *
      (this.bottomRowRef.current.scrollWidth -
        this.bottomRowRef.current.offsetWidth);
  };
  render() {
    this.item = this.props.item;
    return (
            
      <AudintWrapper
        ref={this.topRowRef} 
        onScroll={this.onTopRowScroll}
      >
        <OpeningDiv>
          {generateSection(this.item.audint_section[0], 10)}
        </OpeningDiv>
        <GridDiv>
          <ExhibitionItemWrapper

          >
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
              {documentToReactComponents(this.item.audio.text, richTextOptions)}
            </AudioTextWrapper>
            <AudioPlayer url={this.item.audio.audio.fields.file.url} />
          </AudioWrapper>
        </GridDiv>

      </AudintWrapper>
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
