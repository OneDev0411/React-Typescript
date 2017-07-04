import React from 'react'
import api from '../../../../../../models/Alert'
import AlertViewerModal from '../../../Mls/Partials/AlertViewerModal'

export default class Alert extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      feed: {
        data: [],
        total: 0
      },
      loading: false,
      updated_at: '',
      loadMoreLoading: false
    }

    this._getAlertFeed = this._getAlertFeed.bind(this)
    this.loadMoreFeed = this.loadMoreFeed.bind(this)
  }

  async _getAlertFeed() {
    if (this.state.loading) {
      return false
    }

    let updated_at
    let { feed } = this.state
    const { alert } = this.props

    // set loading
    this.setState({ loading: true })

    try {
      const response = await api.getFeed(alert.id, alert.room)
      const { data, info } = response
      updated_at = data[data.length - 1].updated_at

      feed = {
        data,
        total: info.total
      }
    } catch (e) {
      /* nothing */
    }

    this.setState({
      feed,
      updated_at,
      loading: false
    })
  }

  async loadMoreFeed() {
    if (this.state.loadMoreLoading) {
      return false
    }

    const { alert } = this.props
    let { feed, updated_at } = this.state

    if (!alert || !updated_at) {
      return false
    }

    // set loading
    this.setState({ loadMoreLoading: true })

    try {
      const response = await api.getFeed(alert.id, alert.room, updated_at)
      const { data } = response
      updated_at = data[data.length - 1].updated_at
      feed = {
        ...feed,
        data: [...feed.data, ...data]
      }
    } catch (e) {
      /* nothing */
    }

    this.setState({
      feed,
      updated_at,
      loadMoreLoading: false
    })
  }

  render() {
    const { alert } = this.props
    const { feed, loading } = this.state

    return (
      <div className="alert">
        <strong style={{ color: '#9b9a9b' }}>
          Shared a saved search:
        </strong>

        <div className="alert-widget" onClick={this._getAlertFeed}>
          <div className="icon">
            <img
              src={
                loading
                  ? '/static/images/loading-states/grid-blue.svg'
                  : '/static/images/chatroom/alert.svg'
              }
            />
          </div>

          <div className="heading">
            <div className="title">{alert.title || 'Saved Search'}</div>
            <div className="proposed">
              {alert.proposed_title}
              <i className="fa fa-angle-right" />
            </div>
          </div>
        </div>

        <AlertViewerModal
          feed={feed}
          show={!loading && feed.total}
          onHide={() => this.setState({ feed: { data: [], total: 0 } })}
          loadMoreLoading={this.state.loadMoreLoading}
          loadMore={feed.data.length < feed.total && this.loadMoreFeed}
        />
      </div>
    )
  }
}
