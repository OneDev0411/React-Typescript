import React from 'react'
import { connect } from 'react-redux'
import {
  getContacts,
  removeImportResult
} from '../../../../../store_actions/contact'
import { Tooltip, OverlayTrigger } from 'react-bootstrap'
import ModalImportLoading from './ModalImportLoading'
import config from '../../../../../../config/public'
import { getActiveTeamId } from '../../../../../utils/user-teams'
import Excel from '../../Partials/Svgs/Excel'

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
    return (
      <div className="list--secondary-button">
        <OverlayTrigger
          placement="bottom"
          overlay={<Tooltip id="tooltip">Export Contacts</Tooltip>}
        >
          <a
            href="/api/export/contacts/outlook.csv?fileName=contacts.csv"
            className="button c-button--shadow"
          >
            Export Contacts
          </a>
        </OverlayTrigger>
      </div>
    )
  }
}

export default connect(
  ({ contacts, user }) => ({
    importOutlook: contacts.importOutlook,
    user
  }),
  { getContacts, removeImportResult }
)(ImportOutlook)
