import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { getContacts, uplaodCsv } from '../../../../../store_actions/contact'
import Dropzone from 'react-dropzone'
import HelpIcon from '../../Partials/Svgs/HelpIcon'
import { Dropdown, MenuItem } from 'react-bootstrap'

class ImportCSV extends React.Component {
  async onDropFiles(files) {
    this.props.uplaodCsv(files[0])
  }

  render() {
    return (
      <Fragment>
        <div className="secondary-button">
          <button className="c-button--shadow " onClick={() => this.dropzone.open()}>
            Import from CSV
          </button>
          <Dropdown>
            <Dropdown.Toggle noCaret className="c-button--shadow info-button">
              <HelpIcon className="fa fa-question-circle" />
            </Dropdown.Toggle>
            <Dropdown.Menu className="import-dropdown">
              <MenuItem eventKey="1" header>
                How to export CSV Guide
              </MenuItem>
              <MenuItem
                eventKey="2"
                className="import-dropdown--item"
                onClick={() => {
                  this.loginWindows = window.open(
                    'https://support.office.com/en-us/article/Export-contacts-from-Outlook-10f09abd-643c-4495-bb80-543714eca73f'
                  )
                }}
              >
                Import CSV from Outlook
              </MenuItem>
              <MenuItem divider className="import-dropdown--divider" />
              <MenuItem
                eventKey="3"
                className="import-dropdown--item"
                onClick={() => {
                  this.loginWindows = window.open(
                    'https://support.office.com/en-us/article/import-gmail-contacts-to-outlook-edbacfde-f48c-49da-a6a3-bcbb8f4f4819'
                  )
                }}
              >
                Import CSV from Google
              </MenuItem>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <Dropzone
          disableClick
          ref={ref => (this.dropzone = ref)}
          onDrop={files => this.onDropFiles(files)}
          accept=".csv"
          style={{ display: 'none' }}
        />
      </Fragment>
    )
  }
}

export default connect(
  ({ contacts, user }) => {
    return {
      importInfo: contacts.importCsv,
      user
    }
  },
  { getContacts, uplaodCsv }
)(ImportCSV)
