import React from 'react'
import Flex from 'styled-flex-component'

import Button from 'components/Button/ActionButton'

import { Container } from './styled'

export function Template(props) {
  const { template } = props
  const isVideo = template.video
  const src = `${template.url}/thumbnail.`

  return (
    <Container isSideMenuOpen={props.isSideMenuOpen}>
      {isVideo ? (
        // eslint-disable-next-line
        <video controls>
          <source src={`${src}webm`} type="video/webm" />
          <p>Sorry, your browser doesn't support embedded videos.</p>
        </video>
      ) : (
        <img src={`${src}png`} alt={template.name} />
      )}
      <Flex
        className="action-bar"
        justifyBetween={!isVideo}
        justifyEnd={isVideo}
      >
        {!isVideo && (
          <Button
            appearance="outline"
            onClick={props.handlePreview}
            style={{ backgroundColor: '#FFF' }}
          >
            Preview
          </Button>
        )}
        <Button onClick={props.handleCustomize}>Customize</Button>
      </Flex>
    </Container>
  )
}
