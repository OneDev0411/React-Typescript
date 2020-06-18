import React from 'react'

import { ImageUploader } from 'components/ImageUploader'

import { Container, CropButton, Image } from './styled'
import { uploadAsset } from '../helpers'

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

    this.onImageSelect({ url: response.body.data.file.url })
    this.setState({
      isCropperOpen: false
    })
  }

  onCrop = ({ files }) => {
    const fileName = files.originalFile.split('?')[0].split('/').pop()
    const file = new File([files.file], fileName)

    return this.onCropImg(file)
  }

  render() {
    if (!this.props.target) {
      return false
    }

    const image = this.props.model.get('image')
    const targetElement = this.getTargetElement()
    // const imageWithoutCache = `${image}${
    //   image.includes('?') ? '&dummy=' : '?'
    // }${new Date().getTime()}`

    return (
      <Container>
        <Image src={image} onClick={this.onImageSelect} />
        <CropButton data-test="crop-button" onClick={this.showCropper}>
          Crop and Select
        </CropButton>

        {this.state.isCropperOpen && (
          <ImageUploader
            disableChangePhoto
            file={image}
            width={targetElement.clientWidth * 2}
            height={targetElement.clientHeight * 2}
            saveHandler={this.onCrop}
            closeHandler={this.closeCropper}
          />
        )}
      </Container>
    )
  }
}
