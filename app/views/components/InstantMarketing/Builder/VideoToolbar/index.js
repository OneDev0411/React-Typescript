import React from 'react'

import { normalizeKeyframes } from './helper'
import { VideoControls } from './VideoControls'

export class VideoToolbar extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      activeFrame: 0,
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
        isPlaying: !t.paused
      })

      const currentFrame = this.state.activeFrame
      const current = this.KeyFrames[currentFrame]

      if (current && t.currentTime > current.at) {
        this.setState({
          activeFrame: currentFrame + 1
        })
      }

      if (t.currentTime === t.duration) {
        this.Timeline.pause()
        this.setState({
          isPlaying: false
        })
      }
    }
  }

  get Timeline() {
    return this.view.Timeline
  }

  get KeyFrames() {
    const timeline = this.Timeline

    return timeline
      ? normalizeKeyframes(timeline.keyframes, timeline.duration)
      : []
  }

  seekTo = frameId => {
    this.handlePause()

    const keyframe = this.KeyFrames[frameId]

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
      <VideoControls
        ref={this.props.onRef}
        activeFrame={this.state.activeFrame}
        isPlaying={this.state.isPlaying}
        currentTime={this.Timeline.currentTime}
        duration={this.Timeline.duration}
        keyframes={this.KeyFrames}
        onPause={this.handlePause}
        onPlay={this.handlePlay}
        onSeek={this.seekTo}
      />
    )
  }
}
