import * as React from "react";
import styled from "styled-components";
import "video-react/dist/video-react.css";

import { Player, BigPlayButton, ControlBar } from "video-react";
import { Colour } from "../Global/global.styles";
const VideoPlayerWrapper = styled.div`
    border: ${props => props.withBorder ? `1px solid ${Colour.green}` : 0};
    width: ${props => props.fullScreen ? `100%` : 'auto'};
`

class VideoPlayer extends React.Component {
  render() {
    return (
      <VideoPlayerWrapper fullScreen={this.props.fullScreen} withBorder={this.props.withBorder}>
        <Player autoPlay={this.props.autoPlay ? 1 : 0} fluid={true} preload={'metadata'} poster={this.props.posterUrl} src={this.props.videoUrl}>
          <BigPlayButton position="center" />
          <ControlBar disableCompletely={this.props.fullScreen} />
        </Player>
      </VideoPlayerWrapper>
    );
  }
}

export default VideoPlayer;
