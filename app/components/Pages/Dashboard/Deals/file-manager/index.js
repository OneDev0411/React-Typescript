import React from 'react'
import { connect } from 'react-redux'
import { getDeal, setUploadFiles } from '../../../../../store_actions/deals'
import UploadPromptModal from '../dashboard/upload/prompt'
import PDFSplitterModal from '../pdf-splitter'
import Navbar from './navbar'
import FilesTable from './table'

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

  render() {
    const { deal } = this.props

    return (
      <div className="file-manager">
        <Navbar deal={deal} />
        <div className="content u-scrollbar--thinner">
          <div className="table-container">
            {
              deal.checklists ?
              <FilesTable deal={deal} /> :
              <div className="loading">
                <i className="fa fa-spin fa-spinner fa-3x" />
              </div>
            }
          </div>

          <UploadPromptModal deal={deal} />
          <PDFSplitterModal deal={deal} />
        </div>
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
