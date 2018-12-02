import React from 'react'
import Flex from 'styled-flex-component'

import Button from 'components/Button/ActionButton'

import { Box, ImageContainer } from './styled'

export function Template(props) {
  const { template } = props
  const isVideo = template.video
  const src = `${template.url}/thumbnail.`

  return (
    <Box isSideMenuOpen={props.isSideMenuOpen}>
      <ImageContainer>
        {isVideo ? (
          // eslint-disable-next-line
          <video controls>
            <source src={`${src}mp4`} type="video/mp4" />
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
      </ImageContainer>
    </Box>
  )
}
