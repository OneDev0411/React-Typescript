import React from 'react'
import grapesjs from 'grapesjs'
import 'grapesjs/dist/css/grapes.min.css'
import 'styles/components/modules/template-builder.scss'
import config from './config'
import styleManager from './styles.js'

class TemplateBuilder extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}
    this.editor = null
  }

  componentDidMount() {
    const { template } = this.props

    this.editor = grapesjs.init({
      container : '#canvas',
      components: template,
      panels: config,
      styleManager,
//       deviceManager: {
//         devices: [],
//         deviceLabel: 'Foo'
//       }
    })

    this.setup()
  }

  setup() {

  }

  render() {
    return (
      <div className="template-builder">
        <div id="canvas" />
      </div>
    )
  }
}

export default TemplateBuilder
