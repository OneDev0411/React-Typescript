import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'react-bootstrap'
import cn from 'classnames'
import _ from 'underscore'
import Page from './page'
import Form from './workspace-form'

class Workspace extends React.Component {
  constructor(props) {
    super(props)
  }

  removePage(documentId, pageNumber) {

  }

  render() {
    const { splitter, upload } = this.props

    console.log(splitter.pages)
    return (
      <div>
        <Form />

        <div className="pdfholder">
          {
            _.map(splitter.pages, (page, id) =>
              <Page
                key={`pdf-page-${id}`}
                pdfId={page.documentId}
                doc={splitter.documents[page.documentId]}
                pageNumber={page.pageNumber}
              >
                <span
                  className="page-cta remove"
                  onClick={() => this.removePage(page.documentId, page.pageNumber)}
                >
                  Remove
                </span>
              </Page>
            )
          }
        </div>
      </div>
    )
  }
}

function mapStateToProps({ deals }) {
  return {
    splitter: deals.splitter,
    upload: deals.upload
  }
}

export default connect(mapStateToProps)(Workspace)
