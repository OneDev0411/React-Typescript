import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import { ChromePicker } from 'react-color'
import ClickOutside from 'react-click-outside'

class ModalBrand extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showComposeModal: false,
      title: props.brand && props.brand.name,
      office_title: props.brand && props.brand.messages && props.brand.messages.office_title,
      site_title: props.brand && props.brand.messages && props.brand.messages.site_title,
      pickerVisible: false,
      primaryColor: props.brand && props.brand.palette && props.brand.palette.primary
    }
    this.onChangeComposeModal = this.onChangeComposeModal.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.onTogglePicker = this.onTogglePicker.bind(this)
    this.handleColorChange = this.handleColorChange.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.brand
      && nextProps.activeItem
    ) {
      this.setState({
        title: nextProps.brand.name,
        office_title: nextProps.brand.messages && nextProps.brand.messages.office_title,
        site_title: nextProps.brand.messages && nextProps.brand.messages.site_title,
        primaryColor: nextProps.brand.palette && nextProps.brand.palette.primary
      })
    }
  }

  onChangeComposeModal(showComposeModal) {
    this.setState({ showComposeModal })
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  onTogglePicker(pickerVisible) {
    this.setState({ pickerVisible })
  }

  handleColorChange(color) {
    if (color) {
      this.setState({ primaryColor: color.hex })
    }
  }

  render() {
    const {
      showComposeModal,
      title,
      office_title,
      site_title,
      pickerVisible,
      primaryColor
    } = this.state
    const {
      onButtonClick,
      buttonTitle,
      TriggerButton
    } = this.props
    const titleModal = this.props.title

    return <div style={{ display: 'block' }}>
      <TriggerButton
        clickHandler={() => this.onChangeComposeModal(!showComposeModal)}
      />

      <Modal
        show={showComposeModal}
        dialogClassName="modal-checklist modal-brand"
        onHide={() => {
          this.onChangeComposeModal(false)
          this.onTogglePicker(false)
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {titleModal}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="title">Title</div>
          <div className="input-container">
            <input
              type="text"
              name="title"
              placeholder="Write a brand name…"
              value={title}
              onChange={this.handleChange}
            />
          </div>
          <div className="title">Office Title</div>
          <div className="input-container">
            <input
              type="text"
              name="office_title"
              placeholder="Write office title…"
              value={office_title}
              onChange={this.handleChange}
            />
          </div>
          <div className="title">Site Title</div>
          <div className="input-container">
            <input
              type="text"
              name="site_title"
              placeholder="Write a site title…"
              value={site_title}
              onChange={this.handleChange}
            />
          </div>
          <div className="color-picker-button-container">
            <Button
              className="color-picker-button"
              onClick={() => this.onTogglePicker(!this.state.pickerVisible)}
            >
              Select Color
            </Button>
            <div
              className="selected-color"
              style={{ backgroundColor: this.state.primaryColor }}
            />
          </div>
          { pickerVisible &&
          <ClickOutside
            onClickOutside={() => {
              if (pickerVisible) {
                this.onTogglePicker(false)
              }
            }}
            className="color-picker-container"
          >
            <ChromePicker
              color={primaryColor || 'white'}
              onChangeComplete={this.handleColorChange}
            />
          </ClickOutside>
          }
        </Modal.Body>

        <Modal.Footer>
          <Button
            bsStyle="primary"
            onClick={() => {
              this.onChangeComposeModal(false)

              let brand = {
                name: title,
                palette: { primary: primaryColor },
                messages: {
                  office_title,
                  site_title
                }
              }

              onButtonClick(brand)
            }
            }
          >
            {buttonTitle}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  }
}


export default ModalBrand
