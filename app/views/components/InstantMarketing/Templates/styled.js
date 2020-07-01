import styled, { css } from 'styled-components'

export const Container = styled.div`
  height: 90vh;
  overflow: auto;
  background: white;
  width: 340px;
  background-color: #f1f1f1;
  border: 1px solid #dadada;
`

export const TemplateItem = styled.div`
  border-radius: 5px;
  margin: 1rem;
  cursor: pointer;
  border: 4px solid ${props => (props.isSelected ? '#0945eb' : 'transparent')};
`

const templateItemStyle = css`
  max-width: 100%;
  box-shadow: 0px 5px 10px #c3c3c3;
  margin: 1.5%;
  user-drag: none;
  -webkit-user-drag: none;
`

export const Image = styled.img`
  ${templateItemStyle};
`

export const Video = styled.video`
  ${templateItemStyle};
  max-height: 400px;
`
