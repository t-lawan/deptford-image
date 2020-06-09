import React from "react"
import { BLOCKS, MARKS, INLINES } from '@contentful/rich-text-types';
import styled from 'styled-components';

const PARAGRAPH = styled.p`
    margin-bottom: 0.5rem;
`

const TEAMNAME = styled.p`
    margin-bottom: 0;
`

const NAMEARTICLE = styled.ul`
    list-style-type: none;
    margin: 0;
    margin-bottom: 2rem;
    padding-inline-start: 0;
`

const LOGO = styled.img`
    width: 20%;
    margin-right: 1rem;
`

const NAME = styled.li`
    p{
        margin-bottom: 0.1rem;
    }
`
export const richTextOptions = {
    renderMark: {
      [MARKS.BOLD]: text => <strong>{text}</strong>
    },
    renderNode: {
      [BLOCKS.PARAGRAPH]: (node, children) => <PARAGRAPH>{children}</PARAGRAPH>,
      [BLOCKS.HEADING_4]: (node, children) => <h4> {children} </h4>,
      [INLINES.HYPERLINK]: (node, children) => <a href={node.data.uri} target="__blank">{children}</a>,
      [BLOCKS.OL_LIST]: (node, children) => <ol> {children} </ol>,
      [BLOCKS.UL_LIST]: (node, children) => <NAMEARTICLE> {children} </NAMEARTICLE>,
      [BLOCKS.LIST_ITEM]: (node, children) => <NAME> {children} </NAME>,
      [BLOCKS.EMBEDDED_ASSET]: (node) => <LOGO src={node.data.target.fields.file.url} alt={node.data.target.fields.title} />
      
    }
  };