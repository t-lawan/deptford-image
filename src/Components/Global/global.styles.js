import { createGlobalStyle } from "styled-components";
import KarlaRegular from "../../Assets/Fonts/Karla-Regular.ttf";
import KarlaBold from "../../Assets/Fonts/Karla-Bold.ttf";
import KarlaBoldItalic from "../../Assets/Fonts/Karla-BoldItalic.ttf";
import KarlaItalic from "../../Assets/Fonts/Karla-Italic.ttf";
import AudintBody from "../../Assets/Fonts/AudIntBody.ttf";
import AudintTitle from "../../Assets/Fonts/AudIntTitle.woff";

export const size = {
  mobileS: "320px",
  mobileM: "420px",
  mobileL: "520px",
  mobileSL: "568px",
  mobileXL: "736px",
  tablet: "768px",
  tabletL: "1023px",
  laptop: "1024px",
  laptopM: "1124px",
  laptopL: "1400px",
  desktopS: "1600px",
  desktopM: "1900px",
  desktop: "2260px"
};



export const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: Karla;
    src: url(${KarlaRegular}) format('ttf');
    font-weight: normal;
    font-style: normal;
  }

  @font-face {
    font-family: Karla;
    src: url(${KarlaBold}) format('ttf');
    font-weight: bold;
    font-style: normal;
  }

  @font-face {
    font-family: Karla;
    src: url(${KarlaBoldItalic}) format('ttf');
    font-weight: bold;
    font-style: italic;
  }

  @font-face {
    font-family: Karla;
    src: url(${KarlaItalic}) format('ttf');
    font-weight: normal;
    font-style: italic;
  }

  @font-face {
    font-family: AudintBody;
    src: url(${AudintBody}) format('ttf');
    font-weight: normal;
    font-style: normal;
  }

  @font-face {
    font-family: AudintTitle;
    src: url(${AudintTitle}) format('woff');
    font-weight: normal;
    font-style: normal;
  }
  * {
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    }

html, body {
  margin: 0;
  font-family: Karla, Fallback, sans-serif;
  width: 100%;
  -webkit-font-smoothing: antialiased;
}

.video-react .video-react-big-play-button{
  border: 0 !important;
  border-radius: 0 !important;
}
  `;
