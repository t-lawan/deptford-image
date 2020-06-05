import * as React from "react";
import { Helmet } from "react-helmet";
import Loading from "../Loading/Loading";
import Modal from "../Modal/Modal";
import Instruction from "../Instruction/Instruction";
import { GlobalStyle } from "../Global/global.styles";
import SharingUrl from '../../Assets/DemoSharingImage.jpg'
const Layout = (props) => {
    let description = 'Deptford Moving Image Festival';
    let url = 'https://demomovingimage.net/'
    let title = 'DEMO'
  return (
    <>
      <Helmet>
        <title> {title} </title>
        <meta name="description" content={`${description}`}></meta>
        <meta name="og:title" content={`${title}`}></meta>
        <meta name="og:description" content={`${description}`}></meta>
        <meta name="og:image" content={SharingUrl}></meta>
        <meta name="og:image:height" content={'720'}></meta>
        <meta name="og:image:width" content={'720'}></meta>

        <meta name="og:type" content={`website`}></meta>
        <meta name="og:url" content={`${url}`}></meta>
        <link rel="canonical" href={`${url}`} />
        <meta name="twitter:card" content={`summary`}></meta>
        <meta name="twitter:title" content={`${title}`}></meta>
        <meta name="twitter:description" content={`${description}`}></meta>
      </Helmet>
      <GlobalStyle />
      <Loading />
      <Modal />
      <Instruction />
      <div>
        
        {props.children}
      </div>
    </>
  );
};

export default Layout;
