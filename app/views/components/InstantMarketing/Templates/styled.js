import styled from 'styled-components'

export const Container = styled.div`
  min-height: 90vh;
  max-height: 90vh;
  overflow: auto;
  background: white;
  width: 340px;
  padding: 2rem 0;
  background-color: #f1f1f1;
`

export const TemplateItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  border: 1px solid white;
  border-radius: 5px;
  margin: auto;
  margin-bottom: 20px;
  cursor: pointer;
  width: 292px;
  text-align: center;

  border: 4px solid ${props => (props.isSelected ? '#003bdf' : 'transparent')};

  :hover {
    border: 4px solid #003bdf;
  }
`

export const TemplateVideo = styled.video`
  max-width: 100%;
  max-height: 400px;
  box-shadow: 0px 5px 10px #c3c3c3;
  min-height: 200px;
  margin: 1.5%;
  box-shadow: 0px 5px 10px #c3c3c3;
`
