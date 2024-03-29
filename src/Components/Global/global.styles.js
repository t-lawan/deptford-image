import { createGlobalStyle } from "styled-components";
import AudintBody from "../../Assets/Fonts/AudIntBody.ttf";
import AudintTitle from "../../Assets/Fonts/AudIntTitle.woff";
import GroteskLightExtender from "../../Assets/Fonts/berthold-akzidenz-grotesk-be-light-extended.ttf";
import FreightBigLight from "../../Assets/Fonts/Freight_Big_Light.otf";
import MattoneRegular from "../../Assets/Fonts/Mattone-Regular.otf";

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
export const Colour = {
  green: "#7FFF00",
  // green: '#008000',
  grey: '#D8D7D5',
  pink: '#f3dbff',
  dark_pink: '#f3dbff',
  audint_black: '#0c0924'
};

export const GlobalStyle = createGlobalStyle`
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

  @font-face {
    font-family: 'GroteskLightExtender';
    src: url(${GroteskLightExtender}) format('truetype');
    font-weight: normal;
    font-style: normal;
  }

  @font-face {
    font-family: 'FreightBigLight';
    src: url(${FreightBigLight}) format('opentype');
    font-weight: normal;
    font-style: normal;
  }

  @font-face {
    font-family: MattoneRegular;
    src: url(${MattoneRegular}) format('opentype');
    font-weight: normal;
    font-style: normal;
  }
  * {
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    }

html, body {
  margin: 0;
  font-family: 'GroteskLightExtender', sans-serif;
  width: 100%;
  -webkit-font-smoothing: antialiased;
}
h1,h2,h3,h4,h5,h6 {
    font-family: 'GroteskLightExtender', sans-serif;
    margin-left: 0;
    margin-right: 0;
    margin-top: 0;
    padding-bottom: 0;
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
    font-weight: 100;
    color: inherit;
    }
  a {
    text-decoration: underline;
    color: black;
  font-weight: 100 !important;
  font-family: 'GroteskLightExtender', sans-serif;

  }
  h1 {
  margin-bottom: 1.45rem;
  font-size: 2.5rem;
  line-height: 1.1;
  color: ${Colour.green};

}
h2 {
  margin-bottom: 1.45rem;
  font-size: 1.62671rem;
  line-height: 1.1;
}
h3 {
  margin-bottom: 1.45rem;
  font-size: 1.38316rem;
  line-height: 1.1;
}
h4 {
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
  line-height: 1.1;
  word-break: break-all; 
}
h5 {
  margin-bottom: 1.45rem;
  font-size: 0.85028rem;
  line-height: 1.1;
}
h6 {
  margin-bottom: 1.45rem;
  font-size: 0.78405rem;
}
img {
  max-width: 100%;
  margin-left: 0;
  margin-right: 0;
  margin-top: 0;
  padding-bottom: 0;
  padding-left: 0;
  padding-right: 0;
  padding-top: 0;
  margin-bottom: 1.45rem;
}
p, li{
  margin-left: 0;
  margin-right: 0;
  margin-top: 0;
  margin-bottom: 0.5rem;
  padding-bottom: 0;
  padding-left: 0;
  padding-right: 0;
  padding-top: 0;
  font-size: 1.5rem  !important;
  line-height: 1.3;
  font-weight: 100 !important;
  font-family: 'GroteskLightExtender', sans-serif;
  @media (max-width: ${size.tabletL}) {
    padding: 1.2rem;
  font-size: 1.2rem  !important;

  }
}

p {
  line-height: 1.35;
  font-size: 1.05rem;
  margin-bottom: 1.5rem;
}

.video-react .video-react-big-play-button{
  border: 0 !important;
  border-radius: 0 !important;
}

.react-pdf__Page__svg, svg{
  width: 100% !important;
  height: 100% !important;
  background: transparent !important;
  
}
  `;

