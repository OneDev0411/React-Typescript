import React from 'react'
import PropTypes from 'prop-types'

import { Name } from '../styled'

import StartAt from './StartAt'
import { Steps } from './Steps'
import { Footer } from './Footer'
import { MetaData } from './MetaData'
import { DefaultView } from './DefaultView'
import { Container } from './styled'

function getInitialState(flow) {
  return {
    activeSteps: flow.steps.map(s => s.id),
    id: flow.id,
    starts_at: new Date().getTime() / 1000
  }
}

export class DetailView extends React.Component {
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

  onChangeStep = (id, index) => {
    this.setState(({ activeSteps }) => {
      // shallowCopy
      let activeStepsCopy = activeSteps.slice()

      // it is a remove action
      if (index === -1) {
        activeStepsCopy.splice(activeSteps.indexOf(id), 1)
      } else {
        // insert
        activeStepsCopy.splice(index, 0, id)
      }

      return { activeSteps: activeStepsCopy }
    })
  }

  onChangeStartAt = starts_at => this.setState({ starts_at })

  onAdd = () =>
    this.props.handleAdd({
      origin: this.props.flow.id,
      steps: this.state.activeSteps,
      starts_at: this.state.starts_at
    })

  render() {
    const { flow, isAdding } = this.props

    if (!flow.id) {
      return <DefaultView />
    }

    return (
      <Container column justifyBetween>
        <div>
          <Name>{flow.name}</Name>
          <MetaData steps={flow.steps} />
          <Steps
            activeSteps={this.state.activeSteps}
            onChange={this.onChangeStep}
            steps={flow.steps}
          />
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
