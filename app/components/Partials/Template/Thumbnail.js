import React from 'react'
import './style.scss'

class TemplateBuilder extends React.Component {
  constructor(props) {
    super(props)

    this.svg = React.createRef()

    this.originalWidth = 1000
    this.originalHeight = 1000
  }

  componentDidMount() {
    const svg = this.svg.current

    window.svg = svg

    this.resize()
  }

  resize() {
    const { width, height } = this.props // Target sizes

    const scale = width / this.originalWidth

    this.svg.current.style.transform = `scale(${scale})`
    this.svg.current.style.transformOrigin = 'top left'
  }

  render() {
    const { template, width, height } = this.props
    const markup = {
      __html: template
    }

    const style = {
      width,
      height
    }

    return (
      <div className="template-thumbnail" style={ style }>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          ref={ this.svg }
          width={ this.originalWidth }
          height={ this.originalHeight }
        >
          <foreignObject width="100%" height="100%" dangerouslySetInnerHTML={ markup } />
        </svg>
      </div>
    )
  }
}

export default TemplateBuilder
