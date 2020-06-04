import * as React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import "video-react/dist/video-react.css";

import { Player } from "video-react";
const VideoPlayerWrapper = styled.div``;
class VideoPlayer extends React.Component {
  render() {
    return (
      <VideoPlayerWrapper>
        <Player fluid={true} preload={'metadata'} src={this.props.videoUrl} />
      </VideoPlayerWrapper>
    );
  }
}

export default VideoPlayer;
