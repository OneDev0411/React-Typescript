import React from 'react'

import config from 'config'
import { Editor } from 'components/ImageEditor'
import uploadAsset from 'models/instant-marketing/upload-asset'

import { Container, CropButton, Image } from './styled'

export class AssetImage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isCropperOpen: false
    }
  }

  getTargetElement() {
    return this.props.target.view.el
  }

  getTargetType() {
    return this.props.target.get('type')
  }

  onImageSelect = (options = {}) => {
    const url = options.url || this.props.model.get('image')

    const setBgUrl = () => {
      this.props.target.setAttributes({
        ...this.props.target.getAttributes(),
        'background-url': url
      })
    }
    const setSrc = () => this.props.target.set('src', url)
    const setBg = () => {
      const style = { ...this.props.target.get('style') }

      style['background-image'] = `url(${url})`
      this.props.target.set('style', style)
    }
    const setCarouselImage = () => {
      this.props.target.setAttributes({
        ...this.props.target.getAttributes(),
        src: url
      })
    }

    const setters = {
      image: setSrc,
      'mj-image': setSrc,
      'mj-hero': setBgUrl,
      'mj-carousel-image': setCarouselImage,
      cell: setBg,
      text: setBg,
      '': setBg
    }

    const type = this.getTargetType()

    setters[type]()
  }

  showCropper = () =>
    this.setState({
      isCropperOpen: true
    })

  closeCropper = () =>
    this.setState({
      isCropperOpen: false
    })

  onCropImg = async file => {
    const { templateId } = await this.props.getTemplateId()
    const response = await uploadAsset(file, templateId)

    this.onImageSelect({ url: response.file.url })
    this.setState({
      isCropperOpen: false
    })
  }

  render() {
    if (!this.props.target) {
      return false
    }

    const image = this.props.model.get('image')
    const targetElement = this.getTargetElement()

    return (
      <Container>
        <Image src={image} onClick={this.onImageSelect} />
        <CropButton data-test="crop-button" onClick={this.showCropper}>
          Edit
        </CropButton>

        {this.state.isCropperOpen && (
          <Editor
            file={`${config.proxy.url}/api/utils/cors/${image}`}
            dimensions={[
              targetElement.clientWidth * 2,
              targetElement.clientHeight * 2
            ]}
            onSave={this.onCropImg}
            onClose={this.closeCropper}
          />
        )}
      </Container>
    )
  }
}
