import * as React from "react";
import { connect } from "react-redux";
import DefaultPage from "./DefaultPage";
import ProgrammePage from "./ProgrammePage";
import AboutPage from './AboutPage'
const Page = props => {
  let item = props.pages.find(it => {
    return it.id === props.modal_item;
  });

  let renderedComponent = <p></p>;
  if (item) {
    switch (item.title) {
      case "Programme":
        renderedComponent = <ProgrammePage item={item} />;
        break;
      case "About":
        renderedComponent = <AboutPage item={item} />;
        break;
      default:
        renderedComponent = <DefaultPage item={item} />;
        break;
    }
  }
  return renderedComponent;
};

const mapStateToProps = state => {
  return {
    pages: state.pages,
    modal_item: state.modal_item,
    exhibition_items: state.exhibition_items
  };
};

export default connect(
  mapStateToProps,
  null
)(Page);
