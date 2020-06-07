import * as React from "react";
import styled from "styled-components";
import { connect } from "react-redux";

const PageWrapper = styled.div``;


const Page = props => {
  let item = props.pages.find(it => {
    return it.id === props.modal_item;
  });

  return (
    <PageWrapper>
        <h1> {item.title}</h1>
    </PageWrapper>
  );
};

const mapStateToProps = state => {
  return {
    pages: state.pages,
    modal_item: state.modal_item
  };
};

export default connect(
  mapStateToProps,
  null
)(Page);
