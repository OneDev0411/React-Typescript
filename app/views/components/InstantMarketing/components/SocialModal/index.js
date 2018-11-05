import React from 'react'

import { FacebookProvider, Share } from 'react-facebook'

import ActionButton from 'components/Button/ActionButton'
import { H3 } from 'components/Typography/headings'
import Modal from 'components/BasicModal'

import { getTemplatePreviewImage } from '../../helpers/get-template-preview-image'

export class SocialModal extends React.Component {
  state = {
    image: null
  }

  componentDidMount() {
    this.loadImage()
  }

  facebookAppId = '1084664458366273'

  loadImage = async () => {
    // const image = await getTemplatePreviewImage(this.props.template, false)
    // this.setState({
    //   image
    // })
  }

  render() {
    return (
      <Modal
        isOpen
        shouldCloseOnOverlayClick={false}
        style={{
          content: {
            height: '10rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }
        }}
      >
        <Modal.Body>
          <H3>Share On Social Networks</H3>

          <FacebookProvider appId={this.facebookAppId}>
            <Share href="https://assets.rechat.com/marketing/dc6466e2-a87e-11e8-b68a-0a95998482ac/thumbnail.jpg">
              {({ handleClick, loading }) => (
                <ActionButton disabled={loading} onClick={handleClick}>
                  Share on fb
                </ActionButton>
              )}
            </Share>
          </FacebookProvider>
        </Modal.Body>
      </Modal>
    )
  }
}
