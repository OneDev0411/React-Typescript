import React from 'react'

import { ImageUploader } from 'components/ImageUploader'

import { Container, CropButton, Image } from './styled'
import { uploadAsset } from '../helpers'

export class AssetImage extends React.Component {
  state = {
    isCropperOpen: false
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
      const style = Object.assign({}, this.props.target.get('style'))

      style['background-position'] = '0 0'
      style['background-size'] = 'cover'

      if (options.backgroundPosition) {
        style['background-position'] = options.backgroundPosition
        style['background-repeat'] = 'no-repeat'
      }

      if (options.backgroundSize) {
        style['background-size'] = options.backgroundSize
      }

      style['background-image'] = `url(${url})`
      this.props.target.set('style', style)
    }

    const setters = {
      image: setSrc,
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
    const response = await uploadAsset(file, this.props.templateId)

    this.onImageSelect({ url: response.body.data.file.url })
    this.setState({
      isCropperOpen: false
    })
  }

  onCropNonImg = croppedArea => {
    const target = this.getTargetElement()

    // this formula is patented by Ramin :))
    const newWidth = (1 / croppedArea.width).toFixed(2)
    const newHeight = (1 / croppedArea.height).toFixed(2)
    const left =
      (croppedArea.x * target.clientWidth).toFixed(0) * (-1 * newWidth)
    const top =
      (croppedArea.y * target.clientHeight).toFixed(0) * (-1 * newHeight)

    this.onImageSelect({
      backgroundPosition: `${left}px ${top}px`,
      backgroundSize: `${newWidth * 100}% ${newHeight * 100}%`
    })

    this.setState({
      isCropperOpen: false
    })
  }

  onCrop = ({ croppedArea, files }) => {
    const elementType = this.getTargetType()

    if (elementType === 'image') {
      const fileName = files.originalFile.split('/').reverse()[0]
      const file = new File([files.file], fileName)

      return this.onCropImg(file)
    }

    return this.onCropNonImg(croppedArea)
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
        <CropButton onClick={this.showCropper}>Crop and Select</CropButton>

        {this.state.isCropperOpen && (
          <ImageUploader
            disableChangePhoto
            disableRotate
            noImageCache
            file={image}
            width={targetElement.clientWidth}
            height={targetElement.clientHeight}
            saveHandler={this.onCrop}
            closeHandler={this.closeCropper}
          />
        )}
      </Container>
    )
  }
}
