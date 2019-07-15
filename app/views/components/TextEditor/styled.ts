import styled from 'styled-components'

import 'draft-js/dist/Draft.css'

export const Toolbar = styled.div`
  display: flex;
  align-items: center;
  margin: 1rem 0;
  border-bottom: 1px solid #eee;
  padding-bottom: 1rem;
  display: flex;
  align-items: center;
`

export const Separator = styled.span`
  height: 1rem;
  width: 2px;
  background-color: #ccc;
  margin-right: 1rem;
`

export const EditorWrapper = styled.div`
  &.hide-placeholder {
    .public-DraftEditorPlaceholder-root {
      display: none;
    }
  }
  overflow: hidden; // Allows float styles on images, without collapsing editor height
  img {
    z-index: 1; // This ensures images are selectable even when they are floated
  }
`
