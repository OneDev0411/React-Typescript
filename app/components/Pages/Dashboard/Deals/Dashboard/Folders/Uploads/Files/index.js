import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import Flex from 'styled-flex-component'
import moment from 'moment'

import { TextMiddleTruncate } from 'components/TextMiddleTruncate'
import Tooltip from 'components/tooltip'

import Avatar from 'components/Avatar'

import ActionsButton from '../../../../components/ActionsButton'

import { RowContainer, Row } from '../../styled'

import { FileName, FileDate } from './styled'

class Files extends React.Component {
  getFileLink = file => {
    const taskId = file.task ? file.task.id : 'stash'
    const type = file.envelope ? 'envelope' : 'attachment'
    const id = file.envelope ? file.envelope.id : file.id

    return `/dashboard/deals/${this.props.deal.id}/view/${taskId}/${type}/${id}`
  }

  getFileExtension = file => {
    const ext = file.name.split('.').pop()

    return ext.split('').join(' ')
  }

  getFilePreview = file => {
    if (file.mime.includes('image')) {
      return file.preview_url
    }

    return null
  }

  render() {
    const files = (this.props.deal.files || []).sort(
      (a, b) => b.created_at - a.created_at
    )

    return (
      <div>
        {files.map(file => (
          <RowContainer key={file.id}>
            <Row>
              <Flex onClick={this.toggleTaskOpen} column style={{ flex: 1 }}>
                <Flex alignCenter justifyBetween>
                  <Flex alignCenter>
                    <Avatar
                      size={32}
                      borderRadius={0}
                      image={this.getFilePreview(file)}
                      title={this.getFileExtension(file)}
                      style={{
                        width: '2.2rem',
                        minHeight: '2.5rem',
                        border: '1px solid #eee',
                        borderRadius: '3px'
                      }}
                    />

                    <div style={{ marginLeft: '1rem' }}>
                      <FileName>
                        <Link to={this.getFileLink(file)}>
                          <TextMiddleTruncate text={file.name} maxLength={80} />
                        </Link>
                      </FileName>

                      <FileDate>
                        <Tooltip
                          placement="bottom"
                          caption={moment
                            .unix(file.created_at)
                            .format('MMM DD, YYYY, hh:mm A')}
                        >
                          <span>
                            Uploaded {moment.unix(file.created_at).fromNow()}
                          </span>
                        </Tooltip>
                      </FileDate>
                    </div>
                  </Flex>

                  <ActionsButton
                    type="document"
                    deal={this.props.deal}
                    task={null}
                    document={file}
                  />
                </Flex>
              </Flex>
            </Row>
          </RowContainer>
        ))}
      </div>
    )
  }
}

export default connect(null)(Files)
