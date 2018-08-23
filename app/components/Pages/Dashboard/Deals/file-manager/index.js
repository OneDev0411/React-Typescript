import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { browserHistory } from 'react-router'

import { getDashboardHeight } from '../utils/get-dashboard-height'
import { isTrainingAccount } from '../../../../../utils/user-teams'

import { getDeal, setUploadFiles } from '../../../../../store_actions/deals'
import UploadPromptModal from '../dashboard/upload/prompt'
import PDFSplitterModal from '../pdf-splitter'
import Header from './header'
import FilesTable from './table'

const FileManagerContent = styled.div`
  min-height: ${({ traningAccount }) => getDashboardHeight(traningAccount)};
  max-height: ${({ traningAccount }) => getDashboardHeight(traningAccount)};
  overflow: auto;
`
export class FileManager extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { deal, getDeal } = this.props

    if (!deal) {
      return browserHistory.push('/dashboard/deals')
    }

    if (!deal.checklists) {
      getDeal(deal.id)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.deal) {
      browserHistory.push('/dashboard/deals')
    }
  }

  render() {
    const { deal, user } = this.props
    const traningAccount = isTrainingAccount(user)

    return (
      <div className="file-manager">
        <Header deal={deal} />
        <FileManagerContent
          className="u-scrollbar--thinner"
          traningAccount={traningAccount}
        >
          <div className="table-container">
            {deal.checklists ? (
              <FilesTable deal={deal} />
            ) : (
              <div className="loading">
                <i className="fa fa-spin fa-spinner fa-3x" />
              </div>
            )}
          </div>

          <UploadPromptModal deal={deal} />
          <PDFSplitterModal deal={deal} />
        </FileManagerContent>
      </div>
    )
  }
}

function mapStateToProps({ deals, user }, props) {
  return {
    deal: deals && deals.list ? deals.list[props.params.id] : null,
    user
  }
}

export default connect(
  mapStateToProps,
  {
    getDeal,
    setUploadFiles
  }
)(FileManager)
