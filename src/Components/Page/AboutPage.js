import * as React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { richTextOptions } from "../../Utility/Richtext";
import { Colour } from "../Global/global.styles";
import { getMediaAsset } from "../../Store/action";

const PageWrapper = styled.div`
  padding: 1rem;
  width: 90%;
`;

const TextWrapper = styled.div`
  text-align: left;
`;

const PageTitle = styled.h1`
  padding-bottom: 2rem;
  color: ${Colour.green};
  border-bottom: 1px solid ${Colour.green};
`;

const PartnerWrapper = styled.div``;

const PartnerImagesWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;
const PartnerImage = styled.img`
  object-fit: contain;
`;

const ImageWrapper = styled.div`
  width: 100px;
  height: 100px;
  /* height: auto; */
  display: inline-flex;
`;

const AboutPage = props => {
  let item = props.item;
  return (
    <PageWrapper>
      {item ? (
        <>
          <PageTitle> {item.title}</PageTitle>
          <TextWrapper>
            {" "}
            {documentToReactComponents(item.text, richTextOptions)}{" "}
          </TextWrapper>
          <TextWrapper>
            {item.partners.map((partner, index) => (
              <PartnerWrapper key={index}>
                <p> {partner.title}</p>
                <PartnerImagesWrapper>
                  {partner.images.map((p, i) => (
                    <ImageWrapper key={i}>
                      <PartnerImage src={p.image.file.url} />
                    </ImageWrapper>
                  ))}
                </PartnerImagesWrapper>
              </PartnerWrapper>
            ))}
          </TextWrapper>
        </>
      ) : null}
    </PageWrapper>
  );
};

const mapStateToProps = state => {
  return {
    media_assets: state.media_assets
  };
};

export default connect(
  mapStateToProps,
  null
)(AboutPage);
