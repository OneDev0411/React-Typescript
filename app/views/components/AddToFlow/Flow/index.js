import React from 'react'
import PropTypes from 'prop-types'

import { mockData } from './data'
import { FlowItem } from './FlowItem'
import { DetailView } from './DetailView'
import { Container, ListView } from './styled'

export class Flow extends React.Component {
  static propTypes = {
    alignFrom: PropTypes.string.isRequired,
    associations: PropTypes.shape().isRequired,
    callback: PropTypes.func,
    handleClose: PropTypes.func.isRequired
  }

  static defaultProps = {
    callback() {}
  }

  state = {
    flows: {},
    selectedFlowId: ''
  }

  componentDidMount() {
    this.fetch()
  }

  fetch = () => {
    const flows = {}

    mockData.forEach(f => {
      flows[f.id] = f
    })

    this.setState({
      flows
    })
  }

  onSelectFlow = event => {
    event.persist()

    const { id: selectedFlowId } = event.currentTarget.dataset

    this.setState({ selectedFlowId })
  }

  onAdd = flow => {
    console.log(flow)
  }

  onClose = () => {
    this.props.handleClose()
  }

  render() {
    return (
      <Container depth={3} alignRight={this.props.alignFrom === 'right'}>
        <ListView className="u-scrollbar--thinner--self">
          {Object.values(this.state.flows).map(flow => (
            <FlowItem
              item={flow}
              key={flow.id}
              onSelect={this.onSelectFlow}
              selected={this.state.selectedFlowId === flow.id}
            />
          ))}
        </ListView>
        <DetailView
          flow={this.state.flows[this.state.selectedFlowId]}
          onCancel={this.onClose}
          onAdd={this.onAdd}
        />
      </Container>
    )
  }
}
