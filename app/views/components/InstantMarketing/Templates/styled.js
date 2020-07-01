import styled, { css } from 'styled-components'

export const Container = styled.div`
  min-height: 90vh;
  max-height: 90vh;
  overflow: auto;
  background: white;
  width: 340px;
  background-color: #f1f1f1;
  border: 1px solid #dadada;
  display: flex;
  flex-direction: column;
`

export const TemplateItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  border: 1px solid white;
  border-radius: 5px;
  margin: 0 auto 20px;
  cursor: pointer;
  width: 292px;
  text-align: center;

  border: 4px solid ${props => (props.isSelected ? '#0945eb' : 'transparent')};

  :hover {
    border: 4px solid #0945eb;
  }
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
