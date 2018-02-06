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

    if (!deal.checklists) {
      return false
    }

    return (
      <div className="deal-dashboard file-manager u-scrollbar--thinner">
        <Navbar deal={deal} />
        <FilesTable deal={deal} />

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
