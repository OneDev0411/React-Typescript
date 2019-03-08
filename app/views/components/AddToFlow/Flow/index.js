import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { getBrandFlows } from 'models/brand/get-brand-flows'

import { getActiveTeamId } from 'utils/user-teams'

import { Container } from './styled'
import { ListView } from './ListView'
import { DetailView } from './DetailView'

class Flow extends React.Component {
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
    error: '',
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
        error: error.message,
        isFetching: false
      })
    }
  }

  onSelectFlow = event => {
    event.persist()

    const { id: selectedFlowId } = event.currentTarget.dataset

    this.setState({ selectedFlowId })
  }

  onClose = () => {
    this.props.handleClose()
  }

  render() {
    return (
      <Container depth={3} alignRight={this.props.alignFrom === 'right'}>
        <ListView
          error={this.state.error}
          flows={this.state.flows}
          isFetching={this.state.isFetching}
          onSelect={this.onSelectFlow}
          selectedFlowId={this.state.selectedFlowId}
        />
        <DetailView
          associations={this.props.associations}
          flow={this.state.flows[this.state.selectedFlowId]}
          handleClose={this.onClose}
        />
      </Container>
    )
  }
}

export default connect(state => ({ user: state.user }))(Flow)
