import React from 'react'
import { Modal, Button, DropdownButton, MenuItem } from 'react-bootstrap'
import { compose, withState, pure } from 'recompose'

const enhance = compose(
  pure,
  withState('showComposeModal', 'onChangeComposeModal', false),
  withState('titleChecklist', 'changeTitleChecklist', ''),
  withState('titleDealType', 'changeTitleDealType', ''),
  withState('titlePropertyDealType', 'changeTitlePropertyType', ''),
  withState('titleOrder', 'changeTitleOrder', ''),
)

const ComposeWrapper = ({
                          TriggerButton,
                          title,
                          buttonTitle,
                          onButtonClick,
                          inline = false,
                          showOnly = false,
                          /* internal props and states */
                          showComposeModal,
                          onChangeComposeModal,
                          titleChecklist,
                          changeTitleChecklist,
                          titleDealType,
                          changeTitleDealType,
                          titlePropertyDealType,
                          changeTitlePropertyType,
                          titleOrder,
                          changeTitleOrder
                        }) => {
  const dealTypes = [
    'Buying', 'Selling'
  ]
  const propertyTypes = [
    'Resale', 'New Home', 'Lot / Land', 'Residential Lease', 'Commercial Sale', 'Commercial Lease'
  ]
  const orders = [
    '1', '2', '3'
  ]
  return <div style={{ display: inline ? 'inline' : 'block' }}>
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
            placeholder="Write a checklist name…"
            onChange={(event) => changeTitleChecklist(event.target.value)}
          />
        </div>
        <div className="title">Deal Type</div>
        <DropdownButton
          id="dealTypes"
          title={titleDealType || 'Choose a deal type'}
          onSelect={(selectedItem) => changeTitleDealType(selectedItem)}
        >
          {dealTypes.map(item =>
            <MenuItem eventKey={item}>{item}</MenuItem>
          )}
        </DropdownButton>
        <div className="title">Property Type</div>
        <DropdownButton
          id="propertyTypes"
          title={titlePropertyDealType || 'Any'}
          onSelect={(selectedItem) => changeTitlePropertyType(selectedItem)}
        >
          {propertyTypes.map(item =>
            <MenuItem eventKey={item}>{item}</MenuItem>
          )}
        </DropdownButton>
        <div className="title">Order</div>
        <DropdownButton
          id="orders"
          title={titleOrder || 'Order'}
          onSelect={(selectedItem) => changeTitleOrder(selectedItem)}
        >
          {orders.map(item =>
            <MenuItem eventKey={item}>{item}</MenuItem>
          )}
        </DropdownButton>
      </Modal.Body>

      {!showOnly &&
      <Modal.Footer>
        <Button
          bsStyle="primary"
          disabled={!titleChecklist || !titleDealType || !titlePropertyDealType || !titleOrder}
          onClick={() => {
            onChangeComposeModal(false)
            onButtonClick({
              title: titleChecklist,
              deal_type: titleDealType,
              property_type: titlePropertyDealType,
              order: titleOrder
            })
          }}
        >
          {buttonTitle}
        </Button>
      </Modal.Footer>}
    </Modal>
  </div>
}
export default enhance(ComposeWrapper)
