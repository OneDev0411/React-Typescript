import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { getBrandFlows } from 'models/flows/get-brand-flows'

import { getActiveTeamId } from 'utils/user-teams'

import { Container } from './styled'
import { ListView } from './ListView'
import { DetailView } from './DetailView'

class Flow extends React.Component {
  static propTypes = {
    addError: PropTypes.string,
    alignFrom: PropTypes.string.isRequired,
    isAdding: PropTypes.bool.isRequired,
    handleAdd: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired
  }

  static defaultProps = {
    addError: ''
  }

  state = {
    fetchError: '',
    flows: {},
    isFetching: true,
    selectedFlowId: ''
  }

  componentDidMount() {
    this.fetch()
  }

  fetch = async () => {
    const flows = {}

    try {
      const data = await getBrandFlows(getActiveTeamId(this.props.user))

      data.forEach(f => {
        flows[f.id] = f
      })

      this.setState({
        flows,
        isFetching: false
      })
    } catch (error) {
      this.setState({
        fetchError: error.message,
        isFetching: false
      })
    }
  }

  onSelectFlow = event => {
    event.persist()

    const { id: selectedFlowId } = event.currentTarget.dataset

    this.setState({ selectedFlowId })
  }

  render() {
    return (
      <Container depth={3} alignRight={this.props.alignFrom === 'right'}>
        <ListView
          error={this.state.fetchError}
          flows={this.state.flows}
          isFetching={this.state.isFetching}
          onSelect={this.onSelectFlow}
          selectedFlowId={this.state.selectedFlowId}
        />
        <DetailView
          error={this.props.addError}
          flow={this.state.flows[this.state.selectedFlowId]}
          handleAdd={this.props.handleAdd}
          handleClose={this.props.handleClose}
          isAdding={this.props.isAdding}
        />
      </Container>
    )
  }
}

export default connect(state => ({ user: state.user }))(Flow)
