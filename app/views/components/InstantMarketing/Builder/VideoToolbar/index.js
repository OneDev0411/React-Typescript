import React from 'react'

import { LinearProgress } from '@material-ui/core'
import { mdiPauseCircleOutline, mdiPlayCircleOutline } from '@mdi/js'

import IconButton from 'components/Button/IconButton'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { Container, Divider, FrameButton } from './styled'

export class VideoToolbar extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      activeFrame: 0,
      progress: 0,
      isLoaded: false,
      isPlaying: false
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

    this.Timeline.pause()
    this.seekTo(0)

    this.Timeline.update = t => {
      this.setState({
        isPlaying: !t.paused,
        progress: t.progress
      })

      const next = this.KeyFrames[this.state.activeFrame + 1]

      if (next && t.currentTime > next.at) {
        this.setState(prevState => {
          return {
            activeFrame: prevState.activeFrame + 1
          }
        })
      }
    }
  }

  get Timeline() {
    return this.view.Timeline
  }

  get KeyFrames() {
    const timeline = this.Timeline

    return timeline ? timeline.keyframes : []
  }

  seekTo = frameId => {
    this.handlePause()

    const keyframe = this.Timeline.keyframes[frameId]

    this.setState({
      activeFrame: frameId
    })

    this.Timeline.seek(keyframe.at)
  }

  handlePlay = () => {
    this.Timeline.play()
  }

  handlePause = () => {
    this.Timeline.pause()
    this.setState({
      isPlaying: false
    })
  }

  render() {
    if (this.state.isLoaded === false) {
      return false
    }

    return (
      <Container ref={this.props.onRef}>
        {this.state.isPlaying && (
          <IconButton iconSize="large" isFit onClick={this.handlePause}>
            <SvgIcon path={mdiPauseCircleOutline} />
          </IconButton>
        )}

        {!this.state.isPlaying && (
          <IconButton iconSize="large" isFit onClick={this.handlePlay}>
            <SvgIcon path={mdiPlayCircleOutline} />
          </IconButton>
        )}

        <Divider />

        <div style={{ width: '50%' }}>
          <LinearProgress variant="determinate" value={this.state.progress} />
        </div>

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
