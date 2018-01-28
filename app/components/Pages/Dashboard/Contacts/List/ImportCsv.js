import React from 'react'
import { connect } from 'react-redux'
import { getContacts, uplaodCsv } from '../../../../../store_actions/contact'
import Dropzone from 'react-dropzone'

class ImportOutlook extends React.Component {
  constructor(props) {
    super(props)
  }

  async onDropFiles(files) {
    this.props.uplaodCsv(files[0])
  }

  render() {
    return (
      <div>
        <button
          className="c-button--shadow contacts__toolbar__import"
          onClick={() => this.dropzone.open()}
        >
          Import from Csv
        </button>

        <Dropzone
          disableClick
          ref={ref => (this.dropzone = ref)}
          onDrop={files => this.onDropFiles(files)}
          accept=".csv"
          style={{ display: 'none' }}
        />
      </div>
    )
  }
}

export default connect(
  ({ contacts, user }) => ({
    importOutlook: contacts.importOutlook,
    user
  }),
  { getContacts, uplaodCsv }
)(ImportOutlook)
