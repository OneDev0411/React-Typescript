import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'

import LinkIcon from 'views/components/SvgIcons/LinkIcon'
import ImageFileIcon from 'views/components/SvgIcons/ImageFile/ImageFileIcon'

import { truncateTextFromMiddle } from 'utils/truncate-text-from-middle'
import copy from 'utils/copy-text-to-clipboard'

import Drawer from 'components/OverlayDrawer'

import { getTemplateInstances } from 'models/instant-marketing/get-template-instances'

import { Button as DownloadButton } from './Section/styled'

import PreviewFile from './PreviewFile'
import SendSMS from './SendSMS'

import { Section } from './Section'

class SocialDrawer extends React.Component {
  state = {
    instance: this.props.instance || null,
    error: null
  }

  componentDidMount() {
    this.init()
  }

  init = async () => {
    if (this.state.instance) {
      return false
    }

    try {
      const instance = await getTemplateInstances(this.props.template.id, {
        ...this.props.templateInstanceData,
        html: this.props.template.result
      })

      this.setState({
        instance
      })
    } catch (e) {
      this.setState({
        error: 'Oops, Something went wrong. please try again.'
      })

      console.log(e)
    }
  }

  get FileUrl() {
    return (
      this.state.instance &&
      truncateTextFromMiddle(this.state.instance.file.url, 40)
    )
  }

  get FileName() {
    if (!this.state.instance) {
      return ''
    }

    const { url } = this.state.instance.file

    return truncateTextFromMiddle(url.substring(url.lastIndexOf('/') + 1), 40)
  }

  handleCopyUrl = () => {
    copy(this.state.instance.file.url)

    this.props.notify({
      message: 'Link Copied',
      status: 'success'
    })
  }

  render() {
    return (
      <Drawer isOpen onClose={this.props.onClose} showFooter={false}>
        <Drawer.Header title="How would you like to share?" />
        <Drawer.Body>
          <PreviewFile
            instance={this.state.instance}
            error={this.state.error}
          />

          {this.state.instance && (
            <Fragment>
              <SendSMS instance={this.state.instance} user={this.props.user} />

              <Section
                title="Download Image:"
                description="Download image to your computer and share however you want."
                button={() => (
                  <a target="_blank" href={this.state.instance.file.url}>
                    <DownloadButton>Download</DownloadButton>
                  </a>
                )}
              >
                <ImageFileIcon /> {this.FileName}
              </Section>

              <Section
                title="Copy this URL to Share:"
                buttonCaption="Copy"
                buttonProps={{
                  disabled: !this.state.instance
                }}
                onButtonClick={this.handleCopyUrl}
              >
                <LinkIcon /> {this.FileUrl}
              </Section>
            </Fragment>
          )}
        </Drawer.Body>
      </Drawer>
    )
  }
}

SocialDrawer.propTypes = {
  instance: PropTypes.shape(),
  template: PropTypes.shape(),
  templateInstanceData: PropTypes.shape()
}

SocialDrawer.defaultProps = {}

function mapStateToProps({ user }) {
  return {
    user
  }
}

export default connect(
  mapStateToProps,
  { notify }
)(SocialDrawer)
