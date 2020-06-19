import * as React from "react";
import styled from "styled-components";
import WaveSurfer from "wavesurfer.js";
import ContagionMusic from '../../Assets/Contagion.mp3'
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

const PlayButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 60px;
  background: #EFEFEF;
  border-radius: 50%;
  border: none;
  outline: none;
  cursor: pointer;
  padding-bottom: 3px;  
  &:hover {
    background: #DDD;
  }
`;

class AudioPlayer extends React.Component {
  waveform;
  state = {
    playing: false
  };

  componentDidMount() {
    const track = document.querySelector("#track");

    this.waveform = WaveSurfer.create({
      barWidth: 3,
      cursorWidth: 1,
      container: "#waveform",
      backend: "WebAudio",
      height: 80,
      progressColor: "#2D5BFF",
      responsive: true,
      waveColor: "#EFEFEF",
      cursorColor: "transparent"
    });

    this.waveform.load(this.props.url);
  }

  handlePlay = () => {
    this.setState({ playing: !this.state.playing });
    this.waveform.playPause();
  };

  render() {
    return (
      <WaveformWrapper>
        <PlayButton onClick={this.handlePlay}>Play</PlayButton>
        <Wave id="waveform" />
        <audio id="track" src={ContagionMusic} />
      </WaveformWrapper>
    );
  }
}

export default AudioPlayer;
