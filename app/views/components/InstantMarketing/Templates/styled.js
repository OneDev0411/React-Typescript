import styled from 'styled-components'

export const Container = styled.div`
  min-height: 90vh;
  max-height: 90vh;
  padding: 24px;
  overflow: auto;
  background: white;
`

export const TemplateItem = styled.div`
  background: #f3f3f3;
  height: 400px;
  border: 1px solid white;
  border-radius: 5px;
  margin-bottom: 20px;
  box-shadow: 0px 5px 14px #c3c3c3;
  cursor: pointer;
`

export const TemplateImageContainer = styled.div`
  display: block;
  height: 85%;
  margin: auto;
  padding-top: 20px;
`

export const TemplateImage = styled.div`
  background-image: url(${props => props.src});
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  height: 90%;
`


export const TemplateName = styled.div`
  background: white;
  font-size: 18px;
  font-weight: bold;
  padding: 20px 5px 5px 5px;
  height: 15%;
`