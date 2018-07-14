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
    const { template, assets } = this.props

    this.editor = grapesjs.init({
      container : '#canvas',
      components: template,
      panels: config,
      assetManager: {
        assets
      },
      styleManager,
      storageManager: {
        autoload: 0
      },
      showDevices: false
    })

    this.editor.on('load', this.setup.bind(this))
  }

  onClose() {
    this.props.onClose()
  }

  addButtons() {
    this.addCloseButton()
  }

  setup() {
    this.addButtons()
  }

  addCloseButton() {
    const command = {
      id: 'close-builder',
      run: this.onClose.bind(this)
    }

    const button = {
      id: 'close-builder',
      className: 'fa fa-close',
      command: command,
    }

    this.editor.Panels.addButton('views', button)
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
