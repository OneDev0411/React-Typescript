import React from 'react'
import moment from 'moment'
import Lightbox from 'react-images'

export default class Attachments extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showLightbox: false,
      currentImage: 0
    }
  }

  openBox(pos) {
    this.setState({
      currentImage: pos,
      showLightbox: true
    })
  }

  closeBox() {
    this.setState({ showLightbox: false })
  }

  gotoPrevious () {
    this.setState({
      currentImage: this.state.currentImage - 1
    })
  }

  gotoNext () {
    this.setState({
      currentImage: this.state.currentImage + 1
    })
  }

  render() {
    const { attachments } = this.props
    const { showLightbox } = this.state

    const images = attachments.map(file => ({
      src: file.url
    }))

    return (
      <div className="attachment">
        <strong style={{ color: '#9b9a9b' }}>
          Uploaded an image:
        </strong>

        <Lightbox
          images={images}
          isOpen={showLightbox}
          currentImage={this.state.currentImage}
          onClose={() => this.closeBox()}
          onClickNext={() => this.gotoNext()}
          onClickPrev={() => this.gotoPrevious()}
        />

        <div className="list">
          {
            attachments.map((file, key) =>
              <div
                key={`FILE_${file.id}`}
                className="item"
                onClick={() => this.openBox(key)}
              >
                <img
                  data-src="holder.js/300x200?text=Add \n line breaks \n anywhere."
                  src={file.preview_url}
                />
              </div>
            )
          }
        </div>
      </div>
    )
  }
}
