import React, { Fragment } from 'react'
import { connect } from 'react-redux'

import _ from 'underscore'
import fecha from 'fecha'

import IconAttacment from 'components/SvgIcons/Attachment/IconAttacment'

import { TextMiddleTruncate } from 'components/TextMiddleTruncate'

import { InputError } from 'components/Forms/styled'

import AttachmentsSelectDrawer from '../../../AttachmentsSelect'

import { Container, Icon, Item, Title, DateTime, DeleteIcon } from './styled'

class Attachments extends React.Component {
  handleDelete = attachment => {
    const attachments = _.omit(
      this.props.input.value,
      item => item.id === attachment.id && item.type === attachment.type
    )

    this.props.input.onChange(attachments)
  }

  handleChangeSelectedDocuments = documents => {
    this.props.input.onChange(documents)
    this.props.onChangeSelectedDocuments()
  }

  render() {
    return (
      <Fragment>
        <Container>
          {_.map(this.props.input.value, (attachment, index) => (
            <Item key={index}>
              <Icon>
                <IconAttacment />
              </Icon>

              <div>
                <Title>
                  <a target="_blank" href={attachment.url}>
                    <TextMiddleTruncate
                      text={attachment.title}
                      maxLength={25}
                    />
                  </a>
                </Title>

                <DateTime>
                  Uploaded in&nbsp;
                  {fecha.format(new Date(attachment.date), 'MMM DD, h:mm A')}
                </DateTime>
              </div>

              <DeleteIcon onClick={() => this.handleDelete(attachment)} />
            </Item>
          ))}

          {this.props.meta.error && this.props.meta.touched && (
            <InputError>{this.props.meta.error}</InputError>
          )}
        </Container>

        {this.props.isAttachmentsOpen && (
          <AttachmentsSelectDrawer
            defaultSelectedItems={this.props.input.value}
            deal={this.props.deal}
            onChangeSelectedDocuments={this.handleChangeSelectedDocuments}
            onClose={this.props.onCloseAttachmentsDrawer}
          />
        )}
      </Fragment>
    )
  }
}

function mapStateToProps({ deals }) {
  return {
    tasks: deals.tasks
  }
}

export default connect(mapStateToProps)(Attachments)
