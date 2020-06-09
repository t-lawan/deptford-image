import React from "react"
import { BLOCKS, MARKS, INLINES } from '@contentful/rich-text-types';
import styled from 'styled-components';

export const richTextOptions = {
    renderMark: {
      [MARKS.BOLD]: text => <strong>{text}</strong>
    },
    renderNode: {
      [BLOCKS.PARAGRAPH]: (node, children) => <p>{children}</p>,
      [BLOCKS.HEADING_4]: (node, children) => <h4> {children} </h4>,
      [INLINES.HYPERLINK]: (node, children) => <a href={node.data.uri} target="__blank">{children}</a>,
      [BLOCKS.OL_LIST]: (node, children) => <ol> {children} </ol>,
      [BLOCKS.UL_LIST]: (node, children) => <ul> {children} </ul>
    }
  };