import * as React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import Vimeo from "@u-wave/react-vimeo";

const ExhibitionItemWrapper = styled.div``;

export const ResponsiveIFrameWrapper = styled.div`
  padding: 1rem;
  /* padding: 56.25% 0 0 0;
  position: relative; */
`;
const ExhibitionItem = props => {
  let item = props.exhibition_items.find(it => {
    return it.id === 1;
  });

  return (
    <ExhibitionItemWrapper>
      {item ? <div>
        <h2> {item.title} </h2>
        <p> 
            {item.description}
        </p>
        <ResponsiveIFrameWrapper>
          <Vimeo video={item.vimeo_id} responsive={true} />
        </ResponsiveIFrameWrapper>
      </div> :  null}
    </ExhibitionItemWrapper>
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
)(ExhibitionItem);