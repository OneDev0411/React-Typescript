import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { createTemplateInstance } from 'models/instant-marketing/create-template-instance'
import { getFileType } from 'utils/file-utils/get-file-type'

import getTemplateObject from 'components/InstantMarketing/helpers/get-template-object'
import Drawer from 'components/OverlayDrawer'

import PreviewFile from './PreviewFile'
import SendSMS from './SendSMS'
import DownloadFile from './DownloadFile'
import CopyFileUrl from './CopyFileUrl'

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
      const template = getTemplateObject(this.props.template)

      const instance = await createTemplateInstance(template.id, {
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

  getActions = () => {
    if (
      this.state.instance &&
      getFileType(this.state.instance.file) === 'pdf'
    ) {
      return [DownloadFile, CopyFileUrl]
    }

    if (this.props.socialNetworkName === 'Facebook') {
      return [DownloadFile, SendSMS, CopyFileUrl]
    }

    if (this.props.socialNetworkName === 'LinkedIn') {
      return [DownloadFile, CopyFileUrl]
    }

    return [SendSMS, DownloadFile, CopyFileUrl]
  }

  render() {
    return (
      <Drawer open onClose={this.props.onClose}>
        <Drawer.Header title="How would you like to share?" />
        <Drawer.Body>
          <PreviewFile
            instance={this.state.instance}
            error={this.state.error}
          />

          {this.state.instance && (
            <Fragment>
              {this.getActions().map((Component, index) => (
                <Component
                  key={index}
                  instance={this.state.instance}
                  user={this.props.user}
                />
              ))}
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

export default connect(mapStateToProps)(SocialDrawer)
