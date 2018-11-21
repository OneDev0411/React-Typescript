import styled from 'styled-components'

export const Container = styled.div`
  min-height: 90vh;
  max-height: 90vh;
  padding: 24px;
  overflow: auto;
  background: white;
`

export const TemplateItem = styled.div`
  border: 1px solid white;
  border-radius: 5px;
  margin-bottom: 20px;
  cursor: pointer;

  border: 4px solid ${props => (props.isSelected ? '#003bdf' : 'transparent')};

  :hover {
    border: 4px solid #003bdf;
  }
`

export const TemplateImageContainer = styled.div`
  display: block;
  margin: auto;
  padding-top: 20px;
  text-align: center;
`

export const TemplateImage = styled.img`
  max-width: 90%;
  max-height: 90%;
  box-shadow: 0px 5px 10px #c3c3c3;
`
