import React from 'react'
import cn from 'classnames'
import { Modal, Button, DropdownButton, MenuItem } from 'react-bootstrap'

class Wrapper extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showComposeModal: false,
      titleChecklist: props.checklist && props.checklist.title,
      tabName: props.tabName && props.checklist.tabName,
      titleDealType: props.checklist && props.checklist.deal_type,
      titlePropertyDealType: props.checklist && props.checklist.property_type,
      order: props.checklist && props.checklist.order,
      isTerminatable: props.checklist && props.checklist.is_terminatable
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.checklist
      && nextProps.activeItem
    ) {
      this.setState({
        titleChecklist: nextProps.checklist.title,
        tabName: nextProps.checklist.tab_name,
        titleDealType: nextProps.checklist.deal_type,
        titlePropertyDealType: nextProps.checklist.property_type,
        order: nextProps.checklist.order,
        isTerminatable: nextProps.checklist.is_terminatable
      })
    }
  }

  onChangeComposeModal = showComposeModal => this.setState({ showComposeModal })
  changeTitleChecklist = titleChecklist => this.setState({ titleChecklist })
  changeTabName = tabName => this.setState({ tabName })
  changeTitleDealType = titleDealType => this.setState({ titleDealType })
  changeTitlePropertyType = titlePropertyDealType => this.setState({ titlePropertyDealType })
  changeTitleOrder = order => this.setState({ order })
  changeIsTerminatable = isTerminatable => this.setState({ isTerminatable })

  render() {
    return <ModalNewChecklist
      {...this.props}
      showComposeModal={this.state.showComposeModal}
      titleChecklist={this.state.titleChecklist}
      tabName={this.state.tabName}
      titleDealType={this.state.titleDealType}
      titlePropertyDealType={this.state.titlePropertyDealType}
      order={this.state.order}
      isTerminatable={this.state.isTerminatable}
      onChangeComposeModal={this.onChangeComposeModal}
      changeTitleChecklist={this.changeTitleChecklist}
      changeTabName={this.changeTabName}
      changeTitleDealType={this.changeTitleDealType}
      changeTitlePropertyType={this.changeTitlePropertyType}
      changeTitleOrder={this.changeTitleOrder}
      changeIsTerminatable={this.changeIsTerminatable}
    />
  }
}
const ModalNewChecklist = ({
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
                             order,
                             changeTitleOrder,
                             isTerminatable,
                             changeIsTerminatable,
                             tabName,
                             changeTabName
                           }) => {
  const dealTypes = [
    'any', 'Buying', 'Selling'
  ]
  const propertyTypes = [
    'any', 'Resale', 'New Home', 'Lot / Land', 'Residential Lease', 'Commercial Sale', 'Commercial Lease'
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
            value={titleChecklist}
            onChange={(event) => changeTitleChecklist(event.target.value)}
          />
        </div>
        <div className="title">Tab name</div>
        <div className="input-container">
          <input
            type="text"
            placeholder="Write a tab name…"
            value={tabName}
            onChange={(event) => changeTabName(event.target.value)}
          />
        </div>
        <div className="title">Deal Type</div>
        <DropdownButton
          id="dealTypes"
          title={titleDealType || 'Choose the deal type'}
          onSelect={(selectedItem) => changeTitleDealType(selectedItem)}
        >
          {dealTypes.map(item =>
            <MenuItem
              key={item}
              eventKey={item}
            >{item}
            </MenuItem>
          )}
        </DropdownButton>
        <div className="title">Property Type</div>
        <DropdownButton
          id="propertyTypes"
          title={titlePropertyDealType || 'Choose the property type'}
          onSelect={(selectedItem) => changeTitlePropertyType(selectedItem)}
        >
          {propertyTypes.map(item =>
            <MenuItem
              key={item}
              eventKey={item}
            >{item}
            </MenuItem>
          )}
        </DropdownButton>
        <div className="title">Order</div>
        <DropdownButton
          id="orders"
          title={order || 'Order'}
          onSelect={(selectedItem) => changeTitleOrder(selectedItem)}
        >
          {orders.map(item =>
            <MenuItem
              key={item}
              eventKey={item}
            >{item}
            </MenuItem>
          )}
        </DropdownButton>
        <div className="title">Checklist can be terminated?</div>
        <div >
          <Button
            className={cn('checkBoxIcon', { active: isTerminatable })}
            onClick={() => changeIsTerminatable(!isTerminatable)}
          >
            <i
              className="fa fa-check" aria-hidden="true"
            />
          </Button>
          <span className="checkBoxText">Yes</span>
          <Button
            className={cn('checkBoxIcon', { active: !isTerminatable })}
            onClick={() => changeIsTerminatable(!isTerminatable)}
          >
            <i
              className="fa fa-check" aria-hidden="true"
            />
          </Button>
          <span className="checkBoxText">No</span>
        </div>
      </Modal.Body>

      {!showOnly &&
      <Modal.Footer>
        <Button
          bsStyle="primary"
          disabled={!titleChecklist || !titleDealType || !titlePropertyDealType || !order}
          onClick={() => {
            onChangeComposeModal(false)
            onButtonClick({
              title: titleChecklist,
              deal_type: titleDealType,
              property_type: titlePropertyDealType,
              order,
              is_terminatable: isTerminatable,
              tab_name: tabName
            })
          }}
        >
          {buttonTitle}
        </Button>
      </Modal.Footer>}
    </Modal>
  </div>
}
export default Wrapper
