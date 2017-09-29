import React from 'react'
import AlertFeedModal from '../../../Listings/components/AlertFeedModalViewer'

export default class Alert extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      showModal: false
    }
  }

  setShowModal(state = true) {
    this.setState({
      showModal: state
    })
  }

  render() {
    const { alert } = this.props
    const { showModal, loading } = this.state

    return (
      <div className="alert">
        <strong style={{ color: '#9b9a9b' }}>Shared a saved search:</strong>

        <div className="alert-widget" onClick={() => this.setShowModal()}>
          <div className="icon">
            <img
              src={
                loading ? (
                  '/static/images/loading-states/grid-blue.svg'
                ) : (
                  '/static/images/chatroom/alert.svg'
                )
              }
              alt="alert"
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

        <AlertFeedModal
          alert={alert}
          show={showModal}
          onHide={() => this.setShowModal(false)}
          onChangeLoading={loading => this.setState({ loading })}
        />
      </div>
    )
  }
}
