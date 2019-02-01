import React from 'react'
import { connect } from 'react-redux'
import fecha from 'fecha'
import Flex from 'styled-flex-component'

import Button from 'components/Button/ActionButton'
import IconPlay from 'components/SvgIcons/PlayCircle/IconPlayCircle'
import IconPause from 'components/SvgIcons/PauseCircle/IconPauseCircle'

import { getBrandByType } from 'utils/user-teams'

import { Box, ImageContainer, VideoController } from './styled'

class TemplateItem extends React.Component {
  constructor(props) {
    super(props)

    this.template = props.template

    const brokerageBrand = getBrandByType(props.user, 'Brokerage')

    if (props.template.type === 'template_instance' && props.template) {
      this.template.medium = props.template.template.medium
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
      let thumbnail = `${this.template.url}/${brokerageBrand}/thumbnail.png`

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
    const isInstance = template.type === 'template_instance'
    let editButtonText = 'Customize'

    if (isInstance) {
      editButtonText = template.medium === 'Email' ? 'Compose' : 'Share'
    }

    return (
      <Box isSideMenuOpen={props.isSideMenuOpen} isInstance={isInstance}>
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
            <Button onClick={props.handleCustomize}>{editButtonText}</Button>
          </Flex>
          {isVideo && (
            <VideoController isFit onClick={this.handleVideoPlayPause}>
              {this.renderVideoController()}
            </VideoController>
          )}
        </ImageContainer>
        {isInstance && (
          <div className="c-template__meta">{`Created ${fecha.format(
            new Date(template.created_at * 1000),
            '[on] MMMM DD, YYYY [at] hh:mm A'
          )}`}</div>
        )}
      </Box>
    )
  }
}

function mapStateToProps({ user }) {
  return {
    user
  }
}

export const Template = connect(mapStateToProps)(TemplateItem)
