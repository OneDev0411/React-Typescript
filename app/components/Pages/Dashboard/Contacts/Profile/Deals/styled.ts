import styled from 'styled-components'

// TODO https://gitlab.com/rechat/web/merge_requests/583#note_218120161
export const Container = styled.div`
  display: flex;
  padding: 4px 8px;

  &:hover {
    cursor: pointer;
    border-radius: ${props => props.theme.shape.borderRadius}px;
    background-color: ${props => props.theme.palette.action.hover};
  }
`
