import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Drawer from 'components/OverlayDrawer'

import { getTemplateInstances } from 'models/instant-marketing/get-template-instances'

import PreviewFile from './PreviewFile'
import SendSMS from './SendSMS'
import DownloadImage from './DownloadImage'
import CopyImageUrl from './CopyImageUrl'

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
      const instance = await getTemplateInstances(
        this.props.template.template.id,
        {
          ...this.props.templateInstanceData,
          html: this.props.template.result
        }
      )

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

  get ShowOrder() {
    if (this.props.socialNetworkName === 'Facebook') {
      return [DownloadImage, SendSMS, CopyImageUrl]
    }

    if (this.props.socialNetworkName === 'LinkedIn') {
      return [DownloadImage, CopyImageUrl]
    }

    return [SendSMS, DownloadImage, CopyImageUrl]
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
              {this.ShowOrder.map((Component, index) => (
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
