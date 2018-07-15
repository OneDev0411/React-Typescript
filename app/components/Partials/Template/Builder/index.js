import React from 'react'
import grapesjs from 'grapesjs'
import 'grapesjs/dist/css/grapes.min.css'
import 'styles/components/modules/template-builder.scss'
import config from './config'
import Picker from './Picker'
import './asset-manager'

class TemplateBuilder extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      template: null
    }

    this.editor = null
  }

  componentDidMount() {
    const { assets } = this.props

    this.editor = grapesjs.init({
      ...config,
      container : '#canvas',
      components: null,
      assetManager: {
        assets
      },
      storageManager: {
        autoload: 0
      },
      showDevices: false,
      plugins: ['asset-blocks']
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

  templatePicked(template) {
    this.editor.setComponents(template.template)
  }

  render() {
    const { templates } = this.props
    return (
      <div className="template-builder">
        <Picker
          templates={ templates }
          picked={ this.templatePicked.bind(this) }
        />
        <div className="wrapper">
          <div id="canvas" />
        </div>
      </div>
    )
  }
}

export default TemplateBuilder
