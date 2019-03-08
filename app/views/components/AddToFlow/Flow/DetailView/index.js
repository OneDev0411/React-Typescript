import React from 'react'
import PropTypes from 'prop-types'

import { Name } from '../styled'

import { Footer } from './Footer'
import { MetaData } from './MetaData'
import { DefaultView } from './DefaultView'
import { Container } from './styled'

export class DetailView extends React.Component {
  static propTypes = {
    flow: PropTypes.shape({
      description: PropTypes.string,
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    }),
    onAdd: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
  }

  static defaultProps = {
    flow: { id: '', name: '' }
  }

  state = {
    isAdding: false
  }

  render() {
    const { flow } = this.props

    if (!flow.id) {
      return <DefaultView />
    }

    return (
      <Container column justifyBetween>
        <div>
          <Name>{flow.name}</Name>
          <MetaData steps={flow.steps} />
        </div>
        <Footer
          isAdding={this.state.isAdding}
          disabled={this.state.isAdding}
          onAdd={this.props.onAdd}
          onCancel={this.props.onCancel}
        />
      </Container>
    )
  }
}
