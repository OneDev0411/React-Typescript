import React from 'react'
import fecha from 'fecha'
import Flex from 'styled-flex-component'

import Button from 'components/Button/ActionButton'

import { Box, ImageContainer } from '../../../Templates/List/Template/styled'

export function Template(props) {
  const {
    template: { file }
  } = props
  const isVideo = file.mime.includes('video')

  return (
    <Box isSideMenuOpen={props.isSideMenuOpen}>
      <ImageContainer>
        {isVideo ? (
          // eslint-disable-next-line
          <video controls>
            <source src={file.url} type={file.mime} />
            <p>Sorry, your browser doesn't support embedded videos.</p>
          </video>
        ) : (
          <img src={file.url} alt={file.name} />
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
      <div style={{ marginTop: '0.5rem' }}>{`Created ${fecha.format(
        new Date(file.created_at * 1000),
        '[on] MMMM DD, YYYY [at] HH:mm A'
      )}`}</div>
    </Box>
  )
}
