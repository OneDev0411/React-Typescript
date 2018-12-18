import React from 'react'

import { ImageUploader } from 'components/ImageUploader'

import { Container, CropButton, Image } from './styled'

export class AssetImage extends React.Component {
  state = {
    isCropperOpen: false
  }

  onImageSelect = (options = {}) => {
    const url = this.props.model.get('image')

    const setSrc = () => this.props.target.set('src', url)
    const setBg = () => {
      const style = Object.assign({}, this.props.target.get('style'))

      if (options.backgroundPosition) {
        style['background-position'] = options.backgroundPosition
        style['background-repeat'] = 'no-repeat'
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

    const type = this.props.target.get('type')

    setters[type]()
  }

  get Target() {
    const el = this.props.target.view.el

    return {
      width: el.clientWidth,
      height: el.clientHeight
    }
  }

  showCropper = () =>
    this.setState({
      isCropperOpen: true
    })

  closeCropper = () =>
    this.setState({
      isCropperOpen: false
    })

  onCrop = ({ croppedArea }) => {
    const target = this.Target

    const left = croppedArea.x * target.width * -1
    const top = croppedArea.y * target.height * -1

    console.log(croppedArea, left, top)

    this.onImageSelect({
      backgroundPosition: `${left}px ${top}px`
    })

    this.setState({
      isCropperOpen: false
    })
  }

  render() {
    if (!this.props.target) {
      return false
    }

    const image = this.props.model.get('image')

    return (
      <Container>
        <Image src={image} onClick={this.onImageSelect} />
        <CropButton onClick={this.showCropper}>Crop and Select</CropButton>

        {this.state.isCropperOpen && (
          <ImageUploader
            disableChangeImage
            file={image}
            width={this.Target.width}
            height={this.Target.height}
            saveHandler={this.onCrop}
            closeHandler={this.closeCropper}
          />
        )}
      </Container>
    )
  }
}
