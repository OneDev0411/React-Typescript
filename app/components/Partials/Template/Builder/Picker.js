import React from 'react'
import grapesjs from 'grapesjs'
import 'grapesjs/dist/css/grapes.min.css'
import 'styles/components/modules/template-builder.scss'
import config from './config'

class Picker extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {}

  render() {
    const { templates }  = this.props

    const thumbnails = templates.map(template => {
      return (
        <div
          key={ template.id }
          width={ 200 }
          height={ 100 }
          onClick={ this.props.picked.bind(this, template) }
        >
          {template.name}
        </div>
      )
    })

    return (
      <div className="template-picker">
        {thumbnails}
      </div>
    )
  }
}

export default Picker
