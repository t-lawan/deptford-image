import * as React from "react";
import styled from "styled-components";
import "video-react/dist/video-react.css";

import { Player } from "video-react";
const VideoPlayerWrapper = styled.div`
    /* padding: 2rem; */
`;
class VideoPlayer extends React.Component {
  render() {
    return (
      <VideoPlayerWrapper>
        <Player fluid={true} preload={'metadata'} poster={this.props.posterUrl} src={this.props.videoUrl} />
      </VideoPlayerWrapper>
    );
  }
}

export default VideoPlayer;
