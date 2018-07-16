import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 32px;
  min-height: 100vh;
  max-height: 100vh;
  overflow: auto;
`

const Image = styled.img`
  width: 436px;
  height: 250px;
  margin: 32px 0;
  border-radius: 5px;
  border: 1px solid #ccc;
  cursor: pointer;

  :hover {
    box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.5);
  }
`

const TemplateItem = styled.div`
  width: 436px;
  height: 40px;
  font-size: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #ccc;

  cursor: pointer;

  :hover {
    box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.5);
  }
`

const Templates = props => (
  <Container>
    {/* {images.map((url, index) => <Image key={index} src={url} alt="" />)} */}

    {props.list.map(template => (
      <TemplateItem
        key={template.id}
        onClick={() => props.onTemplateSelect(template)}
      >
        {template.name}
      </TemplateItem>
    ))}
  </Container>
)

export default Templates
