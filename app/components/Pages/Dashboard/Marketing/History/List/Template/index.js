import React from 'react'
import fecha from 'fecha'
import Flex from 'styled-flex-component'

import Button from 'components/Button/ActionButton'
import IconPlay from 'components/SvgIcons/PlayCircle/IconPlayCircle'
import IconPause from 'components/SvgIcons/PauseCircle/IconPauseCircle'

import {
  Box,
  ImageContainer,
  VideoController
} from '../../../Templates/List/Template/styled'

export class Template extends React.Component {
  constructor(props) {
    super(props)

    if (props.template.file.mime.includes('video')) {
      this.isVideo = true
      this.video = React.createRef()
      this.state = { isVideoPlaying: false, isMouseOverImage: false }
    }
  }

  handleVideoPlayPause = event => {
    event.preventDefault()

    const $videoElement = this.video.current

    if ($videoElement.paused || $videoElement.ended) {
      this.setState({ isVideoPlaying: true }, () =>
        $videoElement.play.call($videoElement)
      )
    } else {
      this.setState({ isVideoPlaying: false }, () =>
        $videoElement.pause.call($videoElement)
      )
    }
  }

  renderVideoController = () => {
    const style = { width: '100%', height: '100%', fill: '#fff' }

    if (this.state.isVideoPlaying) {
      return this.state.isMouseOverImage ? <IconPause style={style} /> : null
    }

    return <IconPlay style={style} />
  }

  handleMouseOver = () => {
    if (!this.video) {
      return null
    }

    this.setState(state => ({ isMouseOverImage: !state.isMouseOverImage }))
  }

  render() {
    const { props, isVideo } = this
    const {
      template: { file }
    } = props

    return (
      <Box isSideMenuOpen={props.isSideMenuOpen}>
        <ImageContainer
          onMouseEnter={this.handleMouseOver}
          onMouseLeave={this.handleMouseOver}
        >
          {isVideo ? (
            // eslint-disable-next-line
            <video ref={this.video}>
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
          {isVideo && (
            <VideoController isFit onClick={this.handleVideoPlayPause}>
              {this.renderVideoController()}
            </VideoController>
          )}
        </ImageContainer>
        <div style={{ marginTop: '0.5rem' }}>{`Created ${fecha.format(
          new Date(file.created_at * 1000),
          '[on] MMMM DD, YYYY [at] HH:mm A'
        )}`}</div>
      </Box>
    )
  }
}
