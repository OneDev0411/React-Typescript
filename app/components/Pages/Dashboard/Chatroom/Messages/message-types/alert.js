import React from 'react'
import AlertModel from '../../../../../../models/Alert'
import AlertViewerModal from '../../../Mls/Partials/AlertViewerModal'

export default class Alert extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      feed: null
    }
  }

  async loadAlert(alert) {
    if (this.state.loading)
      return false

    let feed = null
    const { room: roomId, id: alertId } = alert

    // set loading
    this.setState({ loading: true })

    try {
      feed = await AlertModel.getFeed(alertId, roomId)
    } catch(e) { /* nothing */ }

    this.setState({
      feed,
      loading: false
    })
  }

  render() {
    const { alert } = this.props
    const { feed, loading } = this.state

    console.log(feed)
    return (
      <div className="alert">
        <strong style={{ color: '#9b9a9b' }}>
          Shared a saved search:
        </strong>

        <AlertViewerModal
          show={!loading && feed !== null}
          feed={feed}
          onHide={() => this.setState({ feed: null })}
        />

        <div
          className="alert-widget"
          onClick={() => this.loadAlert(alert)}
        >
          <div className="icon">
            <img
              src={
                loading ?
                '/static/images/loading-states/grid-blue.svg':
                '/static/images/chatroom/alert.svg'
              }
            />
          </div>

          <div className="heading">
            <div className="title">{ alert.title }</div>
            <div className="proposed">
              { alert.proposed_title }
              <i className="fa fa-angle-right" />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
