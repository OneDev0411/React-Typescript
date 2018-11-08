import React from 'react'

import { FacebookProvider, Share } from 'react-facebook'

import ActionButton from 'components/Button/ActionButton'
import Modal from 'components/BasicModal'
import Spinner from 'components/Spinner'

import { Container, Heading } from './styled'

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
    const image = await getTemplatePreviewImage(this.props.template, {
      absolute: true
    })

    this.setState({
      image
    })
  }

  render() {
    return (
      <Modal
        isOpen
        shouldCloseOnOverlayClick
        handleOnClose={this.props.onClose}
        style={{
          content: {
            height: '10rem'
          }
        }}
      >
        <Modal.Body>
          <Container>
            <Heading>Share On Social Networks</Heading>

            {!this.state.image && <Spinner />}

            {this.state.image && (
              <FacebookProvider appId={this.facebookAppId}>
                <Share href={this.state.image}>
                  {({ handleClick, loading }) => (
                    <ActionButton disabled={loading} onClick={handleClick}>
                      <i
                        className="fa fa-facebook-square fa-2x"
                        style={{ marginRight: '1rem' }}
                      />
                      Share on Facebook
                    </ActionButton>
                  )}
                </Share>
              </FacebookProvider>
            )}
          </Container>
        </Modal.Body>
      </Modal>
    )
  }
}
