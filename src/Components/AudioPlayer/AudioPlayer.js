import * as React from "react";
import styled from "styled-components";
import WaveSurfer from "wavesurfer.js";
import ContagionMusic from '../../Assets/Contagion.mp3'
import { Colour } from "../Global/global.styles";
import PlayImage from '../../Assets/play.png'
import PlayHoverImage from '../../Assets/play_on_hover.png'
import PauseImage from '../../Assets/pause.png'
import PauseHoverImage from '../../Assets/pause_on_hover.png'
const WaveformWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 100px;
  width: 100%;
  background: transparent;
`;

const Wave = styled.div`
    width: 100%;
    height: 90px;
`;

const PlayButton = styled.img`

`

// const PlayButton = styled.button`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   width: 60px;
//   height: 60px;
//   background: #EFEFEF;
//   border-radius: 50%;
//   border: none;
//   outline: none;
//   cursor: pointer;
//   padding-bottom: 3px;  
//   &:hover {
//     background: #DDD;
//   }
// `;

class AudioPlayer extends React.Component {
  waveform;
  state = {
    playing: false,
    hover: false
  };

  componentDidMount() {
    const track = document.querySelector("#track");

    this.waveform = WaveSurfer.create({
      barWidth: 2,
      barHeight: 2,
      cursorWidth: 1,
      container: "#waveform",
      backend: "WebAudio",
      height: 80,
      progressColor: Colour.dark_pink,
      responsive: true,
      waveColor: Colour.pink,
      cursorColor: Colour.dark_pink,
      barGap: 5,
      scrollParent: true
    });

    this.waveform.load(this.props.url);
  }

  handlePlay = () => {
    this.setState({ playing: !this.state.playing });
    this.waveform.playPause();
  };

  onMouseEnter = () => {
    this.setState({
      hover: true
    })
  }

  onMouseLeave = () => {
    this.setState({
      hover: false
    })
  }

  render() {
    return (
      <WaveformWrapper>
        <PlayButton onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} onClick={this.handlePlay} src={this.state.playing ? (this.state.hover ? PauseHoverImage : PauseImage): (this.state.hover ? PlayHoverImage : PlayImage)} />
        {/* <PlayButton onClick={this.handlePlay}>Play</PlayButton> */}
        <Wave id="waveform" />
        <audio id="track" src={ContagionMusic} />
      </WaveformWrapper>
    );
  }
}

export default AudioPlayer;
