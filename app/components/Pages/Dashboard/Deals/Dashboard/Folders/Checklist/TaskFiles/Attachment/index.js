import React, { Fragment } from 'react'
import { connect } from 'react-redux'

import { syncDeleteFile } from 'actions/deals'

import { BasicDropdown } from 'components/BasicDropdown'
import VerticalDotsIcon from 'components/SvgIcons/MoreVert/IconMoreVert'

import ActionsButton from '../../../../../components/ActionsButton'

import GetSignature from '../../../../../Signature'

import FileLink from './FileLink'

import {
  FileContainer,
  FileRow,
  FileTitle,
  FileActions,
  FileIcon
} from '../styled'

class Attachments extends React.Component {
  state = {
    isDeleting: false
  }

  // menuItems = [
  //   {
  //     label: 'Delete',
  //     onClick: file => this.deleteFile(file)
  //   }
  // ]

  getFileType = file => {
    if (file.mime === 'application/pdf') {
      return 'pdf'
    }

    if (file.mime.includes('image/')) {
      return 'image'
    }

    return 'unknown'
  }

  // deleteFile = async file => {
  //   const { deal, syncDeleteFile } = this.props

  //   if (this.state.isDeleting) {
  //     return false
  //   }

  //   this.setState({
  //     isDeleting: true
  //   })

  //   try {
  //     await syncDeleteFile(deal.id, {
  //       [file.id]: this.props.task
  //     })
  //   } catch (e) {}

  //   this.setState({
  //     isDeleting: false
  //   })
  // }

  render() {
    // const { deal, task, file } = this.props
    const { props, state } = this

    return (
      <Fragment>
        <FileContainer key={props.file.id} isBlur={state.isDeleting}>
          <FileRow>
            <FileTitle>
              <FileLink
                isBackOffice={props.isBackOffice}
                fileType={this.getFileType(props.file)}
                externalUrl={props.file.url}
                internalUrl={`/dashboard/deals/${props.deal.id}/view/${
                  props.task.id
                }/attachment/${props.file.id}`}
              >
                <FileIcon />
                {props.file.name}
              </FileLink>
            </FileTitle>

            <ActionsButton
              type="document"
              deal={this.props.deal}
              task={this.props.task}
              document={props.file}
            />

            {/* <FileActions>
              {file.type === 'pdf' && (
                <GetSignature
                  deal={deal}
                  defaultAttachments={[
                    {
                      task: this.props.task,
                      file
                    }
                  ]}
                />
              )}

              <BasicDropdown
                pullTo="right"
                style={{ marginRight: '-0.2rem' }}
                buttonRenderer={props => <VerticalDotsIcon {...props} />}
                items={this.menuItems}
                onChange={item => item.onClick(file)}
              />
            </FileActions> */}
          </FileRow>
        </FileContainer>
      </Fragment>
    )
  }
}

export default connect(
  null,
  { syncDeleteFile }
)(Attachments)
