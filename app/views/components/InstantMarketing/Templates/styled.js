import styled from 'styled-components'

export const Container = styled.div`
  min-height: 90vh;
  max-height: 90vh;
  padding: 20px;
  overflow: auto;
`

export const TemplateImage = styled.img`
  display: block;
  width: 100%;
  min-height: 156px;
  margin-bottom: 16px;
  border-radius: 3px;
  cursor: pointer;
  transition: box-shadow 0.5s;
  border: 4px solid ${props => (props.isSelected ? '#003bdf' : 'transparent')};

  :hover {
    box-shadow: 0 15px 24px rgba(0, 0, 0, 0.22), 0 19px 76px rgba(0, 0, 0, 0.3);
  }
`
