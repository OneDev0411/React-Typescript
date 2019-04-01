import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

export class Portal extends React.Component {
  constructor(props) {
    super(props)

    this.container = document.createElement('div')
    this.root = document.getElementById(props.root)

    if (!this.root) {
      const rootElement = document.createElement('div')

      rootElement.setAttribute('id', props.root)
      document.body.appendChild(rootElement)

      this.root = rootElement
    }
  }

  componentDidMount() {
    this.root.appendChild(this.container)
  }

  componentWillUnmount() {
    this.root.removeChild(this.container)
  }

  render() {
    return ReactDOM.createPortal(this.props.children, this.container)
  }
}

Portal.propTypes = {
  root: PropTypes.string
}

Portal.defaultProps = {
  root: 'app'
}
