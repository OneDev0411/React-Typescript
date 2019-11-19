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

    const { editor } = this.props

    const wrapper = editor.DomComponents.getWrapper()

    this.view = wrapper.view.el.ownerDocument.defaultView
    this.view.document.addEventListener('load', this.handleLoadTemplate, true)

    editor.on('component:update', () => {
      if (!this.Timeline) {
        return
      }

      this.Timeline.seek(this.Timeline.currentTime)
    })
  }

  handleLoadTemplate = () => {
    if (!this.Timeline || this.state.isLoaded) {
      return false
    }

    this.setState({
      isLoaded: true
    })

    this.seekTo(0)
  }

  get Timeline() {
    return this.view.Timeline
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

    this.Timeline.seek(keyframe.at)
  }

  handlePlay = () => {
    this.seekTo(0)
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
