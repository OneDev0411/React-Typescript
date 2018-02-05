import React from 'react'
import { connect } from 'react-redux'
import Dropzone from 'react-dropzone'
import { getDeal, setUploadFiles } from '../../../../../store_actions/deals'
import Deal from '../../../../../models/Deal'
import UploadPromptModal from '../dashboard/upload/prompt'
import PDFSplitterModal from '../dashboard/upload/pdf-splitter'

export class FileManager extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { deal, getDeal } = this.props

    if (!deal.checklists) {
      getDeal(deal.id)
    }
  }

  backToDeal() {}

  openUploadDialog() {
    this.dropzone.open()
  }

  onDrop(files) {
    const { deal } = this.props

    this.props.setUploadFiles(files, deal, null)
  }

  render() {
    const { deal } = this.props

    return (
      <div className="deal-dashboard u-scrollbar--thinner">
        <div className="deal-navbar">
          <div className="back" onClick={() => this.backToDeal()}>
            <i className="fa fa-chevron-left" />
            Document List
          </div>

          <div className="ctas">
            <button
              className="navbar-button"
              onClick={() => this.openUploadDialog()}
            >
              Upload
            </button>
          </div>
        </div>

        <Dropzone
          disableClick
          ref={node => (this.dropzone = node)}
          onDrop={files => this.onDrop(files)}
          multiple
          accept={Deal.upload.getAcceptedDocuments()}
          style={{ display: 'none' }}
        />

        <UploadPromptModal deal={deal} />
        <PDFSplitterModal deal={deal} />
      </div>
    )
  }
}

function mapStateToProps({ deals }, props) {
  return {
    deal: deals && deals.list ? deals.list[props.params.id] : null
  }
}

export default connect(mapStateToProps, {
  getDeal,
  setUploadFiles
})(FileManager)
