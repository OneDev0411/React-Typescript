import styled from 'styled-components'

export const Container = styled.div`
  min-height: 100vh;
  max-height: 100vh;
  padding: 16px;
  overflow: auto;
`

export const Title = styled.div`
  color: #26465e;
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 15px;
`

export const TemplateImage = styled.img`
  display: block;
  width: 100%;
  max-height: 300px;
  margin-bottom: 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: box-shadow 0.5s;

  :hover {
    box-shadow: 0 15px 24px rgba(0, 0, 0, 0.22), 0 19px 76px rgba(0, 0, 0, 0.3);
  }
`
