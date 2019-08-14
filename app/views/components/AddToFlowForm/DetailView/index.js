import React from 'react'
import PropTypes from 'prop-types'

import { Name } from '../styled'

import StartAt from './StartAt'
import Steps from './Steps'
import Footer from './Footer'
import MetaData from './MetaData'
import ActiveMode from './ActiveMode'
import DefaultView from './DefaultView'
import WithoutStep from './WithoutStep'
import { Container } from './styled'

function getInitialState(flow) {
  return {
    id: flow.id,
    starts_at: new Date().getTime() / 1000
  }
}

export default class DetailView extends React.Component {
  static propTypes = {
    flow: PropTypes.shape({
      description: PropTypes.string,
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      steps: PropTypes.arrayOf(PropTypes.shape()).isRequired
    }),
    handleAdd: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired,
    isAdding: PropTypes.bool.isRequired
  }

  static defaultProps = {
    flow: { id: '', name: '', steps: [] }
  }

  state = getInitialState(this.props.flow)

  static getDerivedStateFromProps(props, state) {
    if (props.flow.id !== state.id) {
      return getInitialState(props.flow)
    }

    return null
  }

  onChangeStartAt = date =>
    this.setState({ starts_at: new Date(date).getTime() / 1000 })

  onAdd = () =>
    this.props.handleAdd({
      origin: this.props.flow.id,
      steps: this.props.flow.steps.map(s => s.id),
      starts_at: this.state.starts_at
    })

  render() {
    const { flow, isAdding } = this.props

    if (!flow.id) {
      return <DefaultView />
    }

    if (flow.isActive) {
      return <ActiveMode />
    }

    if (!Array.isArray(flow.steps) || flow.steps.length === 0) {
      return <WithoutStep flowId={flow.id} />
    }

    return (
      <Container column justifyBetween>
        <div>
          <Name>{flow.name}</Name>
          <MetaData steps={flow.steps} />
          <Steps steps={flow.steps} />
          <StartAt onChange={this.onChangeStartAt} />
        </div>
        <Footer
          disabled={isAdding}
          isAdding={isAdding}
          onAdd={this.onAdd}
          onCancel={this.props.handleClose}
        />
      </Container>
    )
  }
}
