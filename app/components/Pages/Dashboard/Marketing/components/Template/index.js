import React from 'react'
import fecha from 'fecha'
import Flex from 'styled-flex-component'

import Button from 'components/Button/ActionButton'
import IconPlay from 'components/SvgIcons/PlayCircle/IconPlayCircle'
import IconPause from 'components/SvgIcons/PauseCircle/IconPauseCircle'

import { Box, ImageContainer, VideoController } from './styled'

export class Template extends React.Component {
  constructor(props) {
    super(props)

    this.template = props.template

    if (props.template.type === 'template_instance') {
      this.template = {
        ...props.template.template,
        showMeta: true,
        created_at: props.template.created_at
      }
    }

    if (this.template.video) {
      let mime = 'video/mp4'
      let url = `${props.template.url}/thumbnail.mp4`

      if (props.template.file) {
        mime = props.template.file.mime
        url = props.template.file.url
      }

      this.template = {
        ...this.template,
        mime,
        url
      }

      this.isVideo = true
      this.video = React.createRef()
      this.state = { isVideoPlaying: false, isMouseOverImage: false }
    } else {
      let thumbnail = `${this.template.url}/thumbnail.png`

      if (props.template.file) {
        thumbnail = props.template.file.preview_url
      }

      this.template.thumbnail = thumbnail
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
    const { props, isVideo, template } = this

    return (
      <Box isSideMenuOpen={props.isSideMenuOpen}>
        <ImageContainer
          onMouseEnter={this.handleMouseOver}
          onMouseLeave={this.handleMouseOver}
        >
          {isVideo ? (
            // eslint-disable-next-line
            <video ref={this.video}>
              <source src={`${template.url}#t=10`} type={template.mime} />
              <p>Sorry, your browser doesn't support embedded videos.</p>
            </video>
          ) : (
            <img src={template.thumbnail} alt={template.name} />
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
        {template.showMeta && (
          <div style={{ marginTop: '0.5rem' }}>{`Created ${fecha.format(
            new Date(template.created_at * 1000),
            '[on] MMMM DD, YYYY [at] hh:mm A'
          )}`}</div>
        )}
      </Box>
    )
  }
}
