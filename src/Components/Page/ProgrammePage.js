import * as React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { Colour, size } from "../Global/global.styles";
import moment from "moment";
import { PageWrapper } from "./DefaultPage";

const TextWrapper = styled.div`
  text-align: left;
`;

const PageTitle = styled.h1`
  padding-bottom: 2rem;
  color: ${Colour.green};
  border-bottom: 1px solid ${Colour.green};
`;

const Title = styled(PageTitle)`
  border: 0;
  padding-top: 1rem;
`;

const ExhibitionItemWrapper = styled.div`
  display: grid;
  grid-template-columns: 2fr 5fr;
  margin-bottom: 1rem;
  @media (max-width: ${size.tabletL}) {
    grid-template-columns: 1fr;
  }
`;

const ExhibitionItem = styled.div``;

const ExhibitionListItem = styled.div`
  /* display: list-item; */
  /* margin: 1.3rem; */
  /* list-style-type: square;
  ::before {
    content: "•";
    color: ${Colour.green};
    display: inline-block;
    width: 1rem;
  } */
`;

const ExhibitionText = styled.p`
  margin-bottom: 0.5rem;
  @media (max-width: ${size.tabletL}) {
    margin-bottom: 0rem;
    padding: 0;
  }
`;

const ProgrammePage = props => {
  let item = props.item;

  let screenings = props.exhibition_items.filter(item => {
    return item.type === "screening";
  });

  screenings = screenings.sort((a, b) => {
    return moment(a.start_date).diff(moment(b.start_date));
  });

  let special = props.exhibition_items.filter(item => {
    return item.type === "special";
  });
  special = special.sort((a, b) => {
    return moment(a.start_date).diff(moment(b.start_date));
  });

  let reader = props.exhibition_items.filter(item => {
    return item.type === "reader";
  });
  reader = reader.sort((a, b) => {
    return moment(a.start_date).diff(moment(b.start_date));
  });

  return (
    <PageWrapper>
      {item ? (
        <>
          <PageTitle> {item.title}</PageTitle>
          <TextWrapper>
            {" "}
            <Title> Screenings </Title>
            {screenings.map((item, index) => (
              <ExhibitionListItem key={index}>
                <ExhibitionItemWrapper>
                  <ExhibitionItem>
                    <ExhibitionText>
                      {" "}
                      {moment(item.start_date).format("D")} -{" "}
                      {moment(item.end_date).format("D MMMM")}
                    </ExhibitionText>
                  </ExhibitionItem>
                  <ExhibitionItem>
                    <ExhibitionText> {item.participant}</ExhibitionText>
                    <ExhibitionText> {item.title}</ExhibitionText>
                  </ExhibitionItem>
                </ExhibitionItemWrapper>
              </ExhibitionListItem>
            ))}
            <Title> Commisioned Special Projects </Title>
            {special.map((item, index) => (
              <ExhibitionItemWrapper key={index}>
                <ExhibitionItem>
                  <ExhibitionText>
                    {" "}
                    {moment(item.start_date).format("D")} -{" "}
                    {moment(item.end_date).format("D MMMM")}
                  </ExhibitionText>
                </ExhibitionItem>
                <ExhibitionItem>
                  <ExhibitionText> {item.participant}</ExhibitionText>
                  <ExhibitionText> {item.title}</ExhibitionText>
                </ExhibitionItem>
              </ExhibitionItemWrapper>
            ))}
            <Title> Reader </Title>
            {reader.map((item, index) => (
              <ExhibitionItemWrapper key={index}>
                <ExhibitionItem>
                  <ExhibitionText> {item.displayed_time}</ExhibitionText>
                </ExhibitionItem>
                <ExhibitionItem>
                  <ExhibitionText> {item.participant}</ExhibitionText>
                  <ExhibitionText> {item.title}</ExhibitionText>
                </ExhibitionItem>
              </ExhibitionItemWrapper>
            ))}
            {/* {documentToReactComponents(item.text, richTextOptions)}{" "} */}
          </TextWrapper>
        </>
      ) : null}
    </PageWrapper>
  );
};

const mapStateToProps = state => {
  return {
    exhibition_items: state.exhibition_items
  };
};

export default connect(
  mapStateToProps,
  null
)(ProgrammePage);
