import React from 'react'

import { Placeholder } from './styled'

export default class ImageLoader extends React.Component {
  state = {
    image: new Image(),
    isLoaded: false
  }

  componentDidMount() {
    this.loadImage()
  }

  loadImage = () => {
    const { image } = this.state

    image.onload = this.onLoad
    image.src = this.props.src
  }

  onLoad = () =>
    this.setState({
      isLoaded: true
    })

  getStyles = () => ({
    borderRadius: '3px',
    width: `${this.props.width}`,
    height: `${this.props.height}`,
    ...this.props.style
  })

  render() {
    if (!this.state.isLoaded) {
      return (
        <Placeholder
          width={this.props.width}
          height={this.props.height}
          style={this.props.style}
        >
          {this.props.placeholder}
        </Placeholder>
      )
    }

    return (
      <img
        src={this.state.image.src}
        alt={this.props.alt}
        style={this.getStyles()}
      />
    )
  }
}
