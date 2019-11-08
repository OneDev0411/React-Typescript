import styled, { ThemeProps } from 'styled-components'

import 'draft-js/dist/Draft.css'
import { Theme } from '@material-ui/core'

import Flex from 'styled-flex-component'

import { CSSProperties } from 'react'

import { primary, primaryDark } from '../../utils/colors'

export const Toolbar = styled.div`
  display: flex;
  align-items: center;
  margin: 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.42);
  padding: ${({ theme }: ThemeProps<Theme>) => theme.spacing(0.25, 0.5)};
  display: flex;
  align-items: center;
  order: -1;
`

export const Separator = styled.span`
  height: 1rem;
  width: 2px;
  background-color: ${({ theme }: ThemeProps<Theme>) => theme.palette.divider};
  margin: ${({ theme }: ThemeProps<Theme>) => theme.spacing(0, 0.5)};
`
export const EditorContainer = styled(Flex).attrs({ column: true })<{
  minHeight: boolean | CSSProperties['minHeight']
}>`
  flex: 1 1 0%;
  min-height: ${({ minHeight }) =>
    minHeight === true ? '12.5rem' : minHeight || undefined};
`

export const EditorWrapper = styled.div`
  &.hide-placeholder {
    .public-DraftEditorPlaceholder-root {
      display: none;
    }
  }
  overflow: auto; // Allows float styles on images, without collapsing editor height

  display: flex;
  flex-direction: column;
  flex: 1;
  .DraftEditor-root {
    flex: 1;
  }

  img {
    z-index: 1; // This ensures images are selectable even when they are floated
  }

  a:hover {
    text-decoration: inherit;
  }

  .focused,
  .unfocused:hover {
    cursor: default;
    border-radius: 2px;
  }
  .focused {
    box-shadow: 0 0 0 3px ${primaryDark};
  }
  .unfocused:hover {
    box-shadow: 0 0 0 3px ${primary};
  }
`
