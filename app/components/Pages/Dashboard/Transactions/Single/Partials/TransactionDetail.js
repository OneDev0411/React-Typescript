// Dashboard/Transactions/TransactionDetail.js
import React, { Component } from 'react'
import { Carousel, CarouselItem, Modal, Button, FormControl, Col, OverlayTrigger, Tooltip, Dropdown, MenuItem } from 'react-bootstrap'
import S from 'shorti'
import listing_util from '../../../../../../utils/listing'
import helpers from '../../../../../../utils/helpers'
import Dropzone from 'react-dropzone'
import Switch from 'react-ios-switch'

// Partials
import DropzoneOverlay from '../../../Partials/DropzoneOverlay'
import Drawer from './Drawer'
import FileViewer from './FileViewer'
import TasksModule from '../../../Modules/Tasks'

export default class TransactionDetail extends Component {

  componentDidMount() {
    if (typeof window !== 'undefined') {
      const clipboard = require('clipboard')
      new clipboard('.copy-mls')
    }
  }

  handleDragEnter() {
    this.props.dragEnter()
  }

  handleDragLeave() {
    this.props.dragLeave()
  }

  handleAddDocs(files) {
    this.props.addDocs(files)
  }

  drawerDrop(files) {
    // to prevent dupes
    const data = this.props.data
    if (data.current_transaction.overlay_active)
      return false
    this.handleAddDocs(files)
  }

  uploadFile(e) {
    e.preventDefault()
    const file_name = this.refs.file_name.refs.input.value
    this.props.uploadFile(file_name)
  }

  handleNameChange() {
    const file_name = this.refs.file_name.refs.input.value
    this.props.handleNameChange(file_name)
  }

  render() {
    // Data
    const data = this.props.data
    const transaction = data.current_transaction
    const listing = transaction.listing
    const listing_data = transaction.listing_data
    const drawer = transaction.drawer
    // Set transaction data
    const transaction_type = transaction.transaction_type
    // Set transaction property data
    let property
    let address
    let status
    let city
    let state
    let postal_code
    let year_built
    let property_type
    let bedroom_count
    let bathroom_count
    let mls_number
    let square_feet
    let title = 'No address'
    let subtitle

    // Get main body height for drawers
    const containing_body = this.refs.containing_body
    let containing_body_height
    if (containing_body)
      containing_body_height = containing_body.clientHeight

    // If listing
    if (listing) {
      status = listing.status
      property = listing.property
      address = `${property.address.street_number} ${property.address.street_name} ${property.address.street_suffix}`
      city = property.address.city
      state = property.address.state
      postal_code = property.address.postal_code
      title = address
      subtitle = `${address} ${city}, ${state} ${postal_code}`
      mls_number = listing.mls_number
      bedroom_count = property.bedroom_count
      bathroom_count = property.bathroom_count
      square_feet = helpers.numberWithCommas(Math.floor(listing_util.metersToFeet(property.square_meters)))
    }
    // If listing_data
    if (listing_data) {
      status = listing_data.status
      property = listing_data.property
      address = property.address.street_full
      city = property.address.city
      state = property.address.state
      postal_code = property.address.postal_code
      title = address
      subtitle = `${address} ${city}, ${state} ${postal_code}`
      bedroom_count = property.bedroom_count
      bathroom_count = property.bathroom_count
      square_feet = property.square_feet
    }

    let listing_status_indicator
    if (listing) {
      const status_color = listing_util.getStatusColor(listing.status)
      listing_status_indicator = (
        <div className="pull-left" style={ S('bg-F7F9FA relative t-7 br-100 ml-15 pt-12 h-35 pl-36 pr-15 mr-15') }>
          <span style={ S('mr-5 font-46 l-10 t-16n absolute color-' + status_color) }>&#8226;</span>
          <span style={ S('font-14 relative t-3n') }>
            <b>{ listing.status }</b>
          </span>
        </div>
      )
    }
    const prev_icon = '<'
    const next_icon = '>'
    let listing_images = (
      <div style={ S('bg-eff1f2 w-480 h-300 font-22 text-center pt-125 color-929292') }>No image</div>
    )
    const carousel_wh = 'w-480 h-300'

    if (listing) {
      listing_images = (
        <Carousel interval={0} indicators={false} prevIcon={ prev_icon } nextIcon={ next_icon }>
          <CarouselItem>
            <div style={ S(carousel_wh + ' bg-cover bg-center bg-url(' + listing.cover_image_url + ')') }></div>
          </CarouselItem>
          {
            listing.gallery_image_urls.map(gallery_image_url => {
              return (
                <CarouselItem key={ 'gallery-image-' + gallery_image_url }>
                  <img className="hidden" src={ gallery_image_url }/>
                  <div style={ S(carousel_wh + ' bg-cover bg-center bg-url(' + gallery_image_url + ')') }></div>
                </CarouselItem>
              )
            })
          }
        </Carousel>
      )
    }
    let price_area
    if (property) {
      property_type = property.property_type
      year_built = property.year_built
      bathroom_count = property.bathroom_count
      if (transaction.contract_price) {
        price_area = (
          <span style={ S('color-929394 fw-400') }>${ helpers.numberWithCommas(transaction.contract_price) }</span>
        )
      }
    }

    let title_area
    title_area = (
      <div>
        <span className="transaction-detail__title" style={ S('mr-10 pointer') } onClick={ this.props.setDrawerContent.bind(this, 'map', false) }>{ title }</span> { price_area }
      </div>
    )

    const tooltip = (
      <Tooltip id="copied-tooltip">
        Copied
      </Tooltip>
    )

    let mls_link
    if (mls_number) {
      mls_link = (
        <span>
          | MLS#:&nbsp;
          <OverlayTrigger rootClose trigger="click" placement="bottom" overlay={ tooltip }>
            <a href="#" className="copy-mls" data-clipboard-text={ mls_number }>{ mls_number }</a>
          </OverlayTrigger>
        </span>
      )
    }
    let subtitle_area
    if (subtitle) {
      subtitle_area = (
        <div className="pull-left">
          { subtitle } { mls_link }
        </div>
      )
    }
    const title_header_style = {
      ...S('h-80 mb-15 pl-15 pr-15'),
      borderBottom: '1px solid #edf1f3'
    }
    const document_modal = data.document_modal
    let current_file_name
    let current_file_new_name
    let current_file_image
    let current_file_num
    let editing_name
    let document_modal_file_count
    if (data.show_document_modal) {
      const current_file = document_modal.current_file
      document_modal_file_count = document_modal.files.length
      editing_name = document_modal.editing_name
      current_file_num = current_file.index + 1
      current_file_name = current_file.name
      current_file_new_name = current_file.new_name
      current_file_image = <div className="center-block" style={ S('w-100 h-100 p-15') }><i style={ S('font-60 color-929292') } className="fa fa-file-o"></i></div>
      if (current_file.type === 'image/jpeg')
        current_file_image = <img className="center-block" src={ current_file.preview } style={ S(' w-100p h-100p maxw-200 maxh-200') } />
    }

    // Edit transaction
    let listing_image
    if (listing && listing.cover_image_url) {
      listing_image = (
        <div style={ S(`absolute w-100p h-100p bg-center bg-cover bg-url(${listing.cover_image_url})`) }></div>
      )
    } else {
      listing_image = (
        <div style={ S('absolute w-100p h-100p bg-center bg-cover bg-eff1f2 color-929292 pt-170 font-26 text-center') }>
          No image
        </div>
      )
    }
    const input_style = {
      border: 'none'
    }
    const row_style = {
      borderBottom: '1px solid #f3f3f3'
    }
    const btn_action_style = { ...S('w-35 h-35 pointer p-0 br-100 bc-ddd bw-1 solid'), ...{ outline: 'none' } }

    let map_btn
    if (transaction.listing && transaction.listing.property) {
      map_btn = (
        <button onClick={ this.props.setDrawerContent.bind(this, 'map', false) } type="button" className="btn btn-default" style={ { ...btn_action_style, ...S('mr-10') } }>
          <img style={ S('mt-1n') } src={ `/static/images/dashboard/icons/drawer/map${drawer && drawer.content === 'map' ? '-active' : ''}.svg`}/>
        </button>
      )
    }
    // File viewer
    let file_viewer
    if (transaction.viewer) {
      file_viewer = (
        <FileViewer
          data={ data }
          closeFileViewer={ this.props.closeFileViewer }
        />
      )
    }
    // Calculate dom and cdom
    let dom_area
    let cdom_area
    if (listing) {
      if (listing.dom) {
        const dom_days_arr = listing.dom.toString().split('.')
        const dom_miliseconds = dom_days_arr[0]
        const dom_days = helpers.getDaysFromMiliseconds(dom_miliseconds) + ' days'
        dom_area = (
          <div style={ S('mb-15 mr-20 pull-left') }><b>Days on Market:</b> <span style={ S('color-929292') }>{ dom_days }</span></div>
        )
      }
      if (listing.cdom) {
        const cdom_days_arr = listing.cdom.toString().split('.')
        const cdom_miliseconds = cdom_days_arr[0]
        const cdom_days = helpers.getDaysFromMiliseconds(cdom_miliseconds) + ' days'
        cdom_area = (
          <div style={ S('mb-15 mr-20 pull-left') }><b>Current Days on Market:</b> <span style={ S('color-929292') }>{ cdom_days }</span></div>
        )
      }
    }

    let association_fee_area
    if (listing && listing.association_fee) {
      association_fee_area = (
        <div style={ S('mb-15 mr-20 pull-left') }><b>Association Fee:</b> <span style={ S('color-929292') }>${ helpers.numberWithCommas(listing.association_fee) }</span></div>
      )
    }
    // Dropzone overlay
    const overlay_active = transaction.overlay_active
    let tasks_width = 500
    if (window.innerWidth > 1200)
      tasks_width = window.innerWidth - 575
    return (
      <div style={ S('minw-800 z-0') }>
        <Dropzone
          style={ S('w-100p h-100p') }
          disableClick
          onDragEnter={ this.handleDragEnter.bind(this) }
          onDragLeave={ this.handleDragLeave.bind(this) }
          onDrop={ this.handleAddDocs.bind(this) }
        >
          <div style={ S('mt-8 absolute r-10 z-100') }>
            { map_btn }
            <button onClick={ this.props.setDrawerContent.bind(this, 'contacts', false) } type="button" className="btn btn-default" style={ { ...btn_action_style, ...S('mr-10') } }>
              <img style={ S('mt-3n') } src={ `/static/images/dashboard/icons/drawer/contacts${drawer && drawer.content === 'contacts' ? '-active' : ''}.svg`}/>
            </button>
            <button onClick={ this.props.setDrawerContent.bind(this, 'docs', false) } type="button" className="btn btn-default" style={ btn_action_style }>
              <img style={ S('mt-3n') } src={ `/static/images/dashboard/icons/drawer/docs${drawer && drawer.content === 'docs' ? '-active' : ''}.svg`}/>
            </button>
          </div>
          <Drawer
            data={ data }
            closeDrawer={ this.props.closeDrawer }
            deleteFile={ this.props.deleteFile }
            handleDragEnter={ this.handleDragEnter.bind(this) }
            handleDragLeave={ this.handleDragLeave.bind(this) }
            drawerDrop={ this.drawerDrop.bind(this) }
            openFileViewer={ this.props.openFileViewer.bind(this) }
            hideModal={ this.props.hideModal }
            deleteContact={ this.props.deleteContact }
          />
          <div className="transaction-detail__title" style={ title_header_style }>
            <div className="pull-left">
              <h4 style={ S('font-28') }>{ title_area }</h4>
            </div>
            { listing_status_indicator }
            <div className="pull-left text-center" style={ S('bg-F7F9FA relative t-7 br-100 p-8 w-35 h-35 mr-15') }>
              <img src="/static/images/dashboard/icons/link.svg"/>
            </div>
            <div className="pull-left text-center">
              <Dropdown id="settings-dropdown">
                <Dropdown.Toggle noCaret style={ S('pointer bg-F7F9FA relative t-7 br-100 p-8 w-35 h-35 bw-0') }>
                  <i style={ S('color-929292') } className="fa fa-cog"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu className="super-colors">
                  <MenuItem onClick={ this.props.showEditModal.bind(this) }><i className="fa fa-edit" style={ S('mr-10') }></i>Edit</MenuItem>
                  <MenuItem divider />
                  <MenuItem onClick={ this.props.deleteTransaction.bind(this, transaction.id) }><i className="fa fa-trash-o" style={ S('mr-10') }></i>{ data.deleting_transaction && data.deleting_transaction === transaction.id ? 'Deleting...' : 'Delete' }</MenuItem>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div className="clearfix"></div>
            <div style={ S('color-929394 mb-20') }>{ subtitle_area }</div>
          </div>
          <div ref="containing_body" style={ S('relative') }>
            <div style={ S('pl-15 pr-15 w-500') } className="pull-left">
              <div style={ S(carousel_wh + ' mr-15 mb-20') }>
                { listing_images }
              </div>
              <div style={ S('w-500') }>
                <div style={ S('mb-10') }>
                  <div style={ S('mb-15 mr-20 pull-left') }><b>MLS#:</b> <span style={ S('color-929292') }>{ mls_number }</span></div>
                  <div style={ S('mb-15 mr-20 pull-left') }><b>Transaction Type:</b> <span style={ S('color-929292') }>{ transaction_type }</span></div>
                  <div style={ S('mb-15 mr-20 pull-left') }><b>Property Type:</b> <span style={ S('color-929292') }>{ property_type }</span></div>
                  <div style={ S('mb-15 mr-20 pull-left') }><b>Year Built:</b> <span style={ S('color-929292') }>{ year_built }</span></div>
                  <div style={ S('mb-15 mr-20 pull-left') }><b>Beds:</b> <span style={ S('color-929292') }>{ bedroom_count }</span></div>
                  <div style={ S('mb-15 mr-20 pull-left') }><b>Baths:</b> <span style={ S('color-929292') }>{ bathroom_count }</span></div>
                  <div style={ S('mb-15 mr-20 pull-left') }><b>Sqft:</b> <span style={ S('color-929292') }>{ square_feet }</span></div>
                  { dom_area }
                  { cdom_area }
                  { association_fee_area }
                  <div className="clearfix"></div>
                </div>
              </div>
            </div>
             <div style={ S('w-' + tasks_width) } className="pull-left">
                <TasksModule
                  data={ data }
                  module_type="transaction"
                  containing_body_height={ containing_body_height }
                />
              </div>
            <div className="clearfix"></div>
          </div>
        </Dropzone>
        <DropzoneOverlay
          overlay_active={ overlay_active }
          title={ title }
          context="transaction"
        />
        <Modal dialogClassName="modal-800" show={ data.show_document_modal } onHide={ this.props.hideModal.bind(this) }>
          <form onSubmit={ this.uploadFile.bind(this) }>
            <Modal.Header closeButton style={ S('h-45 bc-f3f3f3') }>
              <Modal.Title style={ S('font-14') }>Upload { document_modal_file_count > 1 ? 'multiple files' : 'a file' } <div style={ S('absolute t-15 l-10p mr-20p w-80p z-0 text-center') }>{current_file_num} of { document_modal_file_count }</div></Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="pull-left" style={ S('w-200 mr-10') }>
                <div style={ S('mb-10 pl-10 pr-10') }>{ current_file_image }</div>
              </div>
              <div className="pull-left" style={ S('w-360') }>
                <label>Title</label>
                <FormControl ref="file_name" onChange={ this.handleNameChange.bind(this) } value={ editing_name ? current_file_new_name : current_file_name } type="text" />
                <div style={ S('color-bcc3c6 font-13 mb-15') }>Titles are the easiest ways to search for files: it pays to be descriptive.</div>
                <Col xs={ 10 } style={ S('p-0') }>
                  <label>Make this file Private</label>
                  <div style={ S('color-bcc3c6 font-13') }>
                    Files uploaded are by default Public and can be seen by
                    your clients and whoever has access to this transaction.
                  </div>
                </Col>
                <Col xs={ 2 } style={ S('p-0') }>
                  <div className="pull-right">
                    <Switch checked={ data.doc_switch_checked } onChange={ this.props.uploadFilePermission } />
                  </div>
                </Col>
              </div>
              <div className="clearfix"></div>
            </Modal.Body>
            <Modal.Footer style={ { border: 0 } }>
              <Button bsStyle="link" onClick={ this.props.hideModal.bind(this) }>Cancel</Button>
              <Button style={ S('h-30 pt-5 pl-30 pr-30') } className={ data.creating_contacts ? 'disabled' : '' } type="submit" bsStyle="primary">
                { data.creating_contacts ? 'Uploading...' : 'Upload' }
              </Button>
            </Modal.Footer>
          </form>
        </Modal>
        <Modal dialogClassName="modal-800" show={ transaction.show_edit_modal } onHide={ this.props.hideModal.bind(this) }>
          <form onSubmit={ this.props.editTransaction.bind(this) }>
            <Modal.Body style={ S('p-0') } className="flexbox">
              <Col xs={6} style={ S('p-0') }>
                { listing_image }
              </Col>
              <Col xs={6} style={ S('p-0') }>
                <Modal.Header closeButton style={ S('h-45 bc-f3f3f3') }>
                  <Modal.Title style={ S('font-14') }>Property Info</Modal.Title>
                </Modal.Header>
                <div style={ row_style }>
                  <Col xs={8} style={ S('pl-0 pr-0') }>
                    <label style={ S('p-10 mb-0 fw-400 color-bfc2c3') }>ADDRESS</label>
                    <input className="form-control" style={ input_style } type="text" ref="address" defaultValue={ address }/>
                  </Col>
                  <Col xs={4} style={ S('pr-0') }>
                    <label style={ S('p-10 mb-0 fw-400 color-bfc2c3') }>STATUS</label>
                    <input className="form-control" style={ input_style } type="text" ref="status" defaultValue={ status }/>
                  </Col>
                  <div className="clearfix"></div>
                </div>
                <div style={ row_style }>
                  <Col xs={6} style={ S('pl-0') }>
                    <label style={ S('p-10 mb-0 fw-400 color-bfc2c3') }>CITY</label>
                    <input className="form-control" style={ input_style } type="text" ref="city" defaultValue={ city }/>
                  </Col>
                  <Col xs={3} style={ S('p-0') }>
                    <label style={ S('p-10 mb-0 fw-400 color-bfc2c3') }>STATE</label>
                    <input className="form-control" style={ input_style } type="text" ref="state" defaultValue={ state }/>
                  </Col>
                  <Col xs={3} style={ S('pr-0') }>
                    <label style={ S('p-10 mb-0 fw-400 color-bfc2c3') }>ZIP</label>
                    <input className="form-control" style={ input_style } type="text" ref="postal_code" defaultValue={ postal_code }/>
                  </Col>
                  <div className="clearfix"></div>
                </div>
                <div style={ row_style }>
                  <Col xs={6} style={ S('pl-0 pr-0') }>
                    <label style={ S('p-10 mb-0 fw-400 color-bfc2c3') }>YEAR BUILT</label>
                    <input className="form-control" style={ input_style } type="text" ref="year_built" defaultValue={ year_built }/>
                  </Col>
                  <Col xs={6} style={ S('pr-0') }>
                    <label style={ S('p-10 mb-0 fw-400 color-bfc2c3') }>PROPERTY TYPE</label>
                    <input className="form-control" style={ input_style } type="text" ref="property_type" defaultValue={ property_type }/>
                  </Col>
                  <div className="clearfix"></div>
                </div>
                <div style={ row_style }>
                  <Col xs={4} style={ S('pl-0') }>
                    <label style={ S('p-10 mb-0 fw-400 color-bfc2c3') }>SQFT</label>
                    <input className="form-control" style={ input_style } type="text" ref="square_feet" defaultValue={ square_feet }/>
                  </Col>
                  <Col xs={4} style={ S('p-0') }>
                    <label style={ S('p-10 mb-0 fw-400 color-bfc2c3') }>BEDS</label>
                    <input className="form-control" style={ input_style } type="text" ref="bedroom_count" defaultValue={ bedroom_count }/>
                  </Col>
                  <Col xs={4} style={ S('pr-0') }>
                    <label style={ S('p-10 mb-0 fw-400 color-bfc2c3') }>BATHS</label>
                    <input className="form-control" style={ input_style } type="text" ref="bathroom_count" defaultValue={ bathroom_count }/>
                  </Col>
                  <div className="clearfix"></div>
                </div>
                <div className="pull-right" style={ S('p-15 pb-10') }>
                  <Button bsStyle="link" onClick={ this.props.hideModal.bind(this) }>Cancel</Button>
                  <Button style={ S('h-30 pt-5 pl-30 pr-30') } className={ transaction.editing ? 'disabled' : '' } type="submit" bsStyle="primary">
                    { transaction.editing ? 'Editing...' : 'Edit' }
                  </Button>
                </div>
                <div className="clearfix"></div>
              </Col>
              <div className="clearfix"></div>
            </Modal.Body>
          </form>
        </Modal>
        { file_viewer }
      </div>
    )
  }
}

// PropTypes
TransactionDetail.propTypes = {
  data: React.PropTypes.object,
  deleteTransaction: React.PropTypes.func,
  setDrawerContent: React.PropTypes.func,
  closeDrawer: React.PropTypes.func,
  addDocs: React.PropTypes.func,
  dragEnter: React.PropTypes.func,
  dragLeave: React.PropTypes.func,
  hideModal: React.PropTypes.func,
  uploadFile: React.PropTypes.func,
  deleteFile: React.PropTypes.func,
  handleNameChange: React.PropTypes.func,
  showEditModal: React.PropTypes.func,
  editTransaction: React.PropTypes.func,
  openFileViewer: React.PropTypes.func,
  closeFileViewer: React.PropTypes.func,
  deleteContact: React.PropTypes.func,
  getTransaction: React.PropTypes.func,
  uploadFilePermission: React.PropTypes.func
}
