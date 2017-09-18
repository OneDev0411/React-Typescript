import React from 'react'
import { Modal, Button } from 'react-bootstrap'

class Wrapper extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showComposeModal: false,
      titleBrand: props.brand && props.brand.name
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.brand
      && nextProps.activeItem
    ) {
      this.setState({
        titleBrand: nextProps.brand.name
      })
    }
  }

  onChangeComposeModal = showComposeModal => this.setState({ showComposeModal })
  changeTitleBrand = titleBrand => this.setState({ titleBrand })

  render() {
    return <ModalNewBrand
      {...this.props}
      showComposeModal={this.state.showComposeModal}
      titleBrand={this.state.titleBrand}
      onChangeComposeModal={this.onChangeComposeModal}
      changeTitleBrand={this.changeTitleBrand}
    />
  }
}
const ModalNewBrand = ({
  TriggerButton,
  title,
  buttonTitle,
  onButtonClick,
  inline = false,
  showOnly = false,
  /* internal props and states */
  showComposeModal,
  onChangeComposeModal,
  titleBrand,
  changeTitleBrand
}) => <div style={{ display: inline ? 'inline' : 'block' }}>
  <TriggerButton
    clickHandler={() => onChangeComposeModal(!showComposeModal)}
  />

  <Modal
    show={showComposeModal}
    dialogClassName="modal-checklist"
    onHide={() => onChangeComposeModal(false)}
  >
    <Modal.Header closeButton>
      <Modal.Title>
        {title}
      </Modal.Title>
    </Modal.Header>

    <Modal.Body>
      <div className="title">Title</div>
      <div className="input-container">
        <input
          type="text"
          placeholder="Write a brand name…"
          value={titleBrand}
          onChange={(event) => changeTitleBrand(event.target.value)}
        />
      </div>
    </Modal.Body>

    {!showOnly &&
      <Modal.Footer>
        <Button
          bsStyle="primary"
          onClick={() => {
            onChangeComposeModal(false)
            onButtonClick(titleBrand)
          }}
        >
          {buttonTitle}
        </Button>
      </Modal.Footer>}
  </Modal>
</div>
export default Wrapper
