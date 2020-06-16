import * as React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { Document, Page, View } from "react-pdf";
import { pdfjs } from "react-pdf";
import { Colour, size } from "../Global/global.styles";
import Device from "../../Utility/Device";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
const ExhibitionItemWrapper = styled.div`
  padding: 1rem;
  @media (max-width: ${size.tabletL}) {
    padding: 0;
  }
`;

export const PDFDocument = styled(Document)`
  margin: auto;
`;

const FixedBox = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
`;

const PDFControls = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-content: center;
  align-items: baseline;

`;

const Control = styled.p`
  color: ${Colour.green};
  opacity: ${props => (props.hide ? 0 : 1)};
  cursor: pointer;
  :hover {
    font-style: italic;
  }
`;

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

const MobileText = styled.p`
  color: ${Colour.green};
`;

const MobileTextWrapper = styled.div`
  text-align: center;
`;

const PDFPage = styled(Page)`
  /* div > .react-pdf__Page__svg, div > .react-pdf__Page__svg > svg{
    width: 100% !important;
    height: 100% !important;
  } */
`;
class ReaderExhibitionItem extends React.Component {
  state = {
    numPages: null,
    pageNumber: 1
  };

  previousPage = () => {
    if (this.state.numPages) {
      if (this.state.pageNumber > 1) {
        this.setState({
          pageNumber: this.state.pageNumber - 1
        });
      }
    }
  };

  nextPage = () => {
    if (this.state.numPages) {
      if (this.state.pageNumber < this.state.numPages) {
        this.setState({
          pageNumber: this.state.pageNumber + 1
        });
      }
    }
  };

  isLast = () => {
    return this.state.pageNumber === this.state.numPages;
  };

  isFirst = () => {
    return this.state.pageNumber === 1;
  };
  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages });
  };
  render() {
    this.item = this.props.item;
    return (
      <ExhibitionItemWrapper>
        {1 === 2 ? (
          <>
            {this.item.pdf ? (
              <>
                <PDFDocument
                  file={this.item.pdf.file.url}
                  renderMode={"svg"}
                  onLoadSuccess={this.onDocumentLoadSuccess}
                >
                  {/* <View> */}
                  <Page pageNumber={this.state.pageNumber} />
                  {/* </View> */}
                </PDFDocument>
              </>
            ) : null}
            <FixedBox>
              <PDFControls>
                <Control
                  hide={this.isFirst()}
                  onClick={() => this.previousPage()}
                >
                  {" "}
                  Back
                </Control>
                <MobileLink href={this.item.pdf.file.url} target="_blank"> Download</MobileLink>

                <Control hide={this.isLast()} onClick={() => this.nextPage()}>
                  {" "}
                  Next
                </Control>
              </PDFControls>
            </FixedBox>
          </>
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
