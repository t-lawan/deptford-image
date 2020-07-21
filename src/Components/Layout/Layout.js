import * as React from "react";
import { Helmet } from "react-helmet";
import Loading from "../Loading/Loading";
import Modal from "../Modal/Modal";
import Instruction from "../Instruction/Instruction";
import { GlobalStyle } from "../Global/global.styles";
import SharingUrl from "../../Assets/seo_image.jpg";
import DataPrivacy from "../DataPrivacy/DataPrivacy";
const Layout = props => {
  let description = "DEMO moving image festival is pleased to present its first online edition, taking place from the 15th of June to the 24th of July. As a response to the Covid-19 emergency, this edition of the festival will focus on the topic of Contagion.";
  let url = "https://demomovingimage.net/";
  let title = "DEMO";

  return (
    <>
      <Helmet
        htmlAttributes={{
          lang: "en"
        }}
        title={title}
        meta={[
          {
            rel: "canonical",
            href: `${url}`
          },
          {
            name: `description`,
            content: description
          },
          {
            property: `og:title`,
            content: title
          },
          {
            property: `og:description`,
            content: description
          },
          {
            property: `og:image`,
            content: SharingUrl
          },
          {
            property: `og:image:width`,
            content: `720`
          },
          {
            property: `og:image:height`,
            content: `720`
          },
          {
            property: `og:type`,
            content: `website`
          },
          {
            property: `og:url`,
            content: `${url}`
          },
          {
            name: `twitter:card`,
            content: `summary`
          },
          {
            name: `twitter:title`,
            content: title
          },
          {
            name: `twitter:description`,
            content: description
          }
        ]}
      />
      <GlobalStyle />
      <Loading />
      <Modal />
      <Instruction />
      <div>{props.children}</div>
    </>
  );
};

export default Layout;
