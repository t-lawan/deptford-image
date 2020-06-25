import * as React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { Colour, size } from "../Global/global.styles";
import Device from "../../Utility/Device";
import PDFReader from "../PDFReader/PDFReader";
const ExhibitionItemWrapper = styled.div`
  padding: 1rem;
  @media (max-width: ${size.tabletL}) {
    padding: 0;
  }
`;

const ImageWrapper = styled.div`
  padding: 2rem;
  max-height: 100vh;
  margin: auto;
  text-align: center;

`

const LinkImage = styled.img`
  height: 90vh; 
  :hover {
    border: 1px solid ${Colour.green};
  }
`

const MobileWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  align-content: space-between;
`;
const MobileLink = styled.a`
  color: ${Colour.green};
  text-decoration: ${props => props.underline ? 'underline' : 'none'};
  @media (min-width: ${size.laptop}) {
    font-size: 1.5rem;
  }
`;

const ImageLink = styled.a`

`

const MobileText = styled.p`
  color: ${Colour.green};
`;

const MobileTextWrapper = styled.div`
  text-align: center;
`;

class ReaderExhibitionItem extends React.Component {

  render() {
    this.item = this.props.item;
    console.log('ITEM', this.item)
    return (
      <ExhibitionItemWrapper>
        {!Device.isMobile() ? (
          <ImageWrapper>
            <ImageLink href={this.item.pdf.file.url} target="_blank">
              <LinkImage src={this.item.poster_url} />
            </ImageLink>
            {/* <PDFReader item={this.item}/> */}
          </ImageWrapper>
        ) : (
          <MobileWrapper>
            <MobileTextWrapper>
              {/* <MobileText> {this.item.title} </MobileText> */}
              <MobileLink underline href={this.item.pdf.file.url} target="_blank">
                {" "}
                Download{" "}
              </MobileLink>
            </MobileTextWrapper>
          </MobileWrapper>
        )}
      </ExhibitionItemWrapper>
    );
  }
}

const mapStateToProps = state => {
  return {
    exhibition_items: state.exhibition_items,
    modal_item: state.modal_item
  };
};

export default connect(
  mapStateToProps,
  null
)(ReaderExhibitionItem);
