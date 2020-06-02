import * as React from "react";
import { Helmet } from "react-helmet";
import Loading from "../Loading/Loading";
import Modal from "../Modal/Modal";
import Instruction from "../Instruction/Instruction";

const Layout = (props) => {
    let description = 'Deptford Moving Image Festival';
    let imageUrl = ''
    let url = 'https://demomovingimage.net/'
    let title = 'Deptford Moving Image Festival '
  return (
    <>
      <Helmet>
        <title> {title} </title>
        <meta name="description" content={`${description}`}></meta>

        <meta name="og:description" content={`${description}`}></meta>
        <meta name="og:image" content={`${imageUrl}`}></meta>
        <meta name="og:type" content={`website`}></meta>
        <meta name="og:url" content={`url`}></meta>

        <meta name="twitter:card" content={`summary`}></meta>
        <meta name="twitter:title" content={`${title}`}></meta>
        <meta name="twitter:description" content={`${description}`}></meta>
      </Helmet>
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
