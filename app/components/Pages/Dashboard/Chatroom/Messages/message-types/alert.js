import React from 'react'
import AlertViewerModal from '../../../Mls/Partials/AlertViewerModal'

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
        <strong style={{ color: '#9b9a9b' }}>
          Shared a saved search:
        </strong>

        <div className="alert-widget" onClick={() => this.setShowModal()}>
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
          alert={alert}
          show={showModal}
          onChangeLoading={loading => this.setState({ loading })}
          onHide={() => this.setShowModal(false)}
        />
      </div>
    )
  }
}
