import React from 'react'

import IconPlay from 'components/SvgIcons/Play/IconPlay'
import IconButton from 'components/Button/IconButton'

import { Container, Divider, FrameButton } from './styled'

export class VideoToolbar extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      activeFrame: 0,
      isLoaded: false
    }

    const view = this.props.editor.DomComponents.getWrapper().view.el
      .ownerDocument.defaultView

    view.document.addEventListener('load', this.handleLoadTemplate, true)
  }

  handleLoadTemplate = () => {
    if (!this.Timeline || this.state.isLoaded) {
      return false
    }

    this.setState({
      isLoaded: true
    })

    this.seekTo(1)
  }

  get Timeline() {
    return this.props.editor.DomComponents.getWrapper().view.el.ownerDocument
      .defaultView.Timeline
  }

  get KeyFrames() {
    const timeline = this.Timeline

    return timeline ? timeline.keyframes : []
  }

  seekTo = frameId => {
    const keyframe = this.Timeline.keyframes[frameId]

    this.setState({
      activeFrame: frameId
    })

    this.Timeline.seekTo(keyframe.at)
  }

  handlePlay = () => {
    this.Timeline.reset()
    this.Timeline.play()
  }

  render() {
    if (this.state.isLoaded === false) {
      return false
    }

    return (
      <Container ref={this.props.onRef}>
        <IconButton iconSize="large" isFit onClick={this.handlePlay}>
          <IconPlay />
        </IconButton>

        <Divider />

        {this.KeyFrames.map((frame, index) => (
          <FrameButton
            appearance="outline"
            className={this.state.activeFrame === index ? 'is-active' : ''}
            key={index}
            onClick={() => this.seekTo(index)}
          >
            {index + 1}
          </FrameButton>
        ))}
      </Container>
    )
  }
}
