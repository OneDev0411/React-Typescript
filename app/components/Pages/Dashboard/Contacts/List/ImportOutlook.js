import React from 'react'
import { connect } from 'react-redux'
import { removeImportResult } from '../../../../../store_actions/contact'
import getContacts from '../../../../../store_actions/contacts/get-contacts'
import { Tooltip, OverlayTrigger } from 'react-bootstrap'
import ModalImportLoading from './ModalImportLoading'
import config from '../../../../../../config/public'

class ImportOutlook extends React.Component {
  constructor(props) {
    super(props)

    this.url = `${config.api_url}/authorize-ms-graph\
?failEvent=importFail\
&user=${this.props.userId}\
&doneEvent=importDone\
&authSuccessEvent=importSuccesfullLogin\
&client=web`
    this.loginWindows = undefined
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.importOutlook.done) {
      this.props.getContacts()
      this.props.removeImportResult()
      this.loginWindows && this.loginWindows.close()
    }

    if (nextProps.importOutlook.failLogin) {
      this.props.removeImportResult()
    }
  }

  render() {
    const { SuccessfulLogin } = this.props.importOutlook

    return (
      <div className="list--secondary-button">
        <OverlayTrigger
          placement="bottom"
          overlay={
            <Tooltip id="tooltip">
              Integrate with Outlook to auto-import your contacts
            </Tooltip>
          }
        >
          <button
            className="c-button--shadow "
            onClick={() => {
              this.loginWindows = window.open(
                this.url,
                'myWindow',
                'width=300,height=500'
              )
            }}
          >
            Import from Outlook
          </button>
        </OverlayTrigger>
        <ModalImportLoading show={SuccessfulLogin} />
      </div>
    )
  }
}

function mapStateToProps({ user, contacts }) {
  const { importOutlook } = contacts

  return {
    user,
    importOutlook
  }
}

export default connect(mapStateToProps, { getContacts, removeImportResult })(
  ImportOutlook
)
