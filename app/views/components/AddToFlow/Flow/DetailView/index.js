import React from 'react'
import PropTypes from 'prop-types'

import { Name } from '../styled'

import { Steps } from './Steps'
import { Footer } from './Footer'
import { MetaData } from './MetaData'
import { DefaultView } from './DefaultView'
import { Container } from './styled'

function getInitialState(flow) {
  return {
    id: flow.id,
    isAdding: false,
    activeSteps: flow.steps.map(s => s.id)
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
    handleClose: PropTypes.func.isRequired
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

  onCancel = this.props.handleClose

  onAdd = () => {
    console.log('add')
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
          <Steps
            activeSteps={this.state.activeSteps}
            onChange={this.onChangeStep}
            steps={flow.steps}
          />
        </div>
        <Footer
          isAdding={this.state.isAdding}
          disabled={this.state.isAdding}
          onAdd={this.onAdd}
          onCancel={this.onCancel}
        />
      </Container>
    )
  }
}
