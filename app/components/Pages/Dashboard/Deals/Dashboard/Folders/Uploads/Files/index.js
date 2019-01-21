import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import fecha from 'fecha'
import Flex from 'styled-flex-component'

import Avatar from 'components/Avatar'

import { TextMiddleTruncate } from 'components/TextMiddleTruncate'

import ActionsButton from '../../../../components/ActionsButton'

import { RowContainer, Row, RowLeftColumn, RowRightColumn } from '../../styled'

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
              <RowLeftColumn>
                <Flex alignCenter>
                  <Avatar
                    size={32}
                    image={this.getFilePreview(file)}
                    title={this.getFileExtension(file)}
                  />
                  <div style={{ marginLeft: '1rem' }}>
                    <FileName>
                      <Link to={this.getFileLink(file)}>
                        <TextMiddleTruncate text={file.name} maxLength={80} />
                      </Link>
                    </FileName>

                    <FileDate>
                      {fecha.format(
                        new Date(file.created_at * 1000),
                        'YYYY/MM/DD hh:mm A'
                      )}
                    </FileDate>
                  </div>
                </Flex>
              </RowLeftColumn>

              <RowRightColumn>
                <ActionsButton
                  type="document"
                  deal={this.props.deal}
                  task={null}
                  document={file}
                />
              </RowRightColumn>
            </Row>
          </RowContainer>
        ))}
      </div>
    )
  }
}

export default connect(null)(Files)
