import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { Dropdown, MenuItem } from 'react-bootstrap'
import {
  getContacts,
  removeImportResult
} from '../../../../../store_actions/contacts'
import ModalImportLoading from './ModalImportLoading'
import config from '../../../../../../config/public'

class Import extends React.Component {
  constructor(props) {
    super(props)

    this.url = `${config.api_url}/authorize-ms-graph\
?failEvent=importFail\
&user=${this.props.userId}\
&doneEvent=importDone\
&authSuccessEvent=importSuccesfullLogin\
&client=web`
    this.loginWindows = undefined

    console.log('api_url in import: ', config.api_url)
  }

  componentWillReceiveProps(nextProps) {
    const { getContacts, removeImportResult } = this.props

    if (
      nextProps.importOutlook.done &&
      this.props.importOutlook.done !== nextProps.importOutlook.done
    ) {
      getContacts()
      removeImportResult()
      this.loginWindows && this.loginWindows.close()
    }

    if (
      nextProps.importOutlook.failLogin &&
      this.props.importOutlook.failLogin !== nextProps.importOutlook.failLogin
    ) {
      removeImportResult()
    }
  }

  render() {
    const { SuccessfulLogin } = this.props.importOutlook

    return (
      <div className="list--secondary-button">
        <Dropdown id="import-csv-dropdown">
          <Dropdown.Toggle className="button c-button--shadow">
            Import
          </Dropdown.Toggle>

          <Dropdown.Menu className="import-dropdown">
            <MenuItem
              eventKey="2"
              className="import-dropdown--item"
              onClick={() =>
                browserHistory.push('/dashboard/contacts/import/csv')
              }
            >
              Import From CSV
            </MenuItem>

            <MenuItem
              eventKey="3"
              className="import-dropdown--item"
              onClick={() => {
                this.loginWindows = window.open(
                  this.url,
                  'myWindow',
                  'width=300,height=500'
                )
              }}
            >
              Connect to Outlook
            </MenuItem>
          </Dropdown.Menu>
        </Dropdown>

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
  Import
)
