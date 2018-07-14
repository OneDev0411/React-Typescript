import React from 'react'
import './style.scss'
import superagent from 'superagent'

class TemplateBuilder extends React.Component {
  constructor(props) {
    super(props)

    this.el = React.createRef()
  }

  componentDidMount() {
    this.load()
  }

  async load() {
    const res = await superagent
    .post('http://localhost:3000/screenshot')
    .responseType('blob')
    .send({
      html: this.props.template.template,
      viewport: {
        width: 600,
        height: 300
      },
      width: this.props.width,
      height: this.props.height
    })


    const reader  = new FileReader()
    reader.addEventListener('load', () => {
      this.el.current.style.backgroundImage = `url(${reader.result})`
    })

    reader.readAsDataURL(res.body)
  }

  onClick() {
    this.props.onClick()
  }

  render() {
    const { width, height } = this.props

    const style = {
      width,
      height
    }

    return (
      <div
        className="template-thumbnail"
        onClick={ this.onClick.bind(this) }
        style={ style }
        ref={ this.el }
      />
    )
  }
}

export default TemplateBuilder
