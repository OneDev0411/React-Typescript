// Dashboard/Transactions/TransactionDetail.js
import React, { Component } from 'react'
import { Carousel, CarouselItem, Modal, Button, Input, Col } from 'react-bootstrap'
import S from 'shorti'
import listing_util from '../../../../../utils/listing'
import helpers from '../../../../../utils/helpers'
import Dropzone from 'react-dropzone'

// Partials
import ProfileImage from '../../Partials/ProfileImage'

export default class TransactionDetail extends Component {

  handleAddDocs(files) {
    this.props.addDocs(files)
  }

  handleDragEnter() {
    this.props.dragEnter()
  }

  handleDragLeave() {
    this.props.dragLeave()
  }

  drawerDrop(files) {
    // to prevent dupes
    const data = this.props.data
    if (data.current_transaction.drag_enter)
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

  openFile(file) {
    window.open(file.preview)
  }

  handleViewMore() {
    this.props.handleViewMore()
  }

  render() {
    // Data
    const data = this.props.data
    const transaction = data.current_transaction
    const listing = transaction.listing
    const listing_data = transaction.listing_data
    const drawer = transaction.drawer
    const attachments = transaction.attachments
    // Set transaction data
    const transaction_type = transaction.transaction_type
    const contacts = transaction.contacts
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
      mls_number = listing_data.mls_number
      bedroom_count = property.bedroom_count
      bathroom_count = property.bathroom_count
      square_feet = property.square_feet
    }
    let listing_status_indicator
    if (listing) {
      const status_color = listing_util.getStatusColor(listing.status)
      listing_status_indicator = (
        <div className="pull-left" style={ S('pointer bg-F7F9FA relative t-7 br-100 ml-15 pt-12 h-35 pl-36 pr-15 mr-15') }>
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
        <span style={ S('mr-10') }>{ title }</span> { price_area }
      </div>
    )

    let mls_link
    if (mls_number) {
      mls_link = (
        <span>| <a href="#">MLS#: { mls_number }</a></span>
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
    // Drawer
    let drawer_content
    const drawer_height = window.innerHeight - 203
    let drawer_wrap_style = {
      ...S('absolute h-' + drawer_height + ' r-0 w-0 t-79'),
      overflow: 'hidden'
    }
    const drawer_style = {
      ...S('absolute h-' + drawer_height + ' z-100 bg-fff w-500'),
      borderLeft: '6px solid #edf1f3'
    }
    let drawer_class
    if (transaction.drawer_active)
      drawer_class = 'active'
    if (drawer) {
      drawer_wrap_style = {
        ...drawer_wrap_style,
        ...S('w-500')
      }
      let attachments_markup
      let file_icon_short
      // console.log(attachments)
      if (attachments) {
        attachments_markup = attachments.map((file, i) => {
          switch (file.type) {
            case 'application/pdf':
              file_icon_short = 'PDF'
              break
            case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
              file_icon_short = 'DOC'
              break
            case 'text/plain':
              file_icon_short = 'TXT'
              break
            default:
              file_icon_short = 'FILE'
          }

          let file_image = (
            <a href={ file.preview } target="_blank" className="pull-left" style={ S('ml-10 w-60 h-60 color-929292') }>
              <i style={ S('font-50') } className="fa fa-file-o"></i>
              { file_icon_short }
            </a>
          )
          if (file.type === 'image/jpeg') {
            file_image = (
              <a href={ file.preview } target="_blank" className="pull-left" style={ S('w-60 h-60 ml-10 bg-url(' + file.preview + ') bg-cover bg-center br-2') }></a>
            )
          }
          const file_style = {
            ...S('h-80 pb-10 pt-10 color-929292 pointer'),
            borderBottom: '1px solid #f7f9fa'
          }
          return (
            <div className="transaction--file" key={ 'file-' + i } style={ file_style }>
              <Button onClick={ this.props.deleteFile.bind(this, file) } style={ S('mt-10 mr-10 absolute r-0') } bsStyle="danger" className="pull-right delete">Delete</Button>
              <div onClick={ this.openFile.bind(this, file) } className="pull-left">
                { file_image }
              </div>
              <div onClick={ this.openFile.bind(this, file) } style={ S('w-350') } className="pull-left text-left">
                <div style={ S('ml-10 color-444 font-14 mb-5') }>{ file.new_name ? file.new_name : file.name }</div>
                <div style={ S('w-150 ml-10 font-12') }>Jan 15, 8:17am - Mark</div>
                <div style={ S('w-150 ml-10 font-12') }>Shared with Shayan</div>
              </div>
              <div className="clearfix"></div>
            </div>
          )
        })
      }
      const dropzone_style = {
        ...S('w-100p h-100p pb-25'),
        borderBottom: '1px solid #f7f9fa'
      }
      const doczone_height = window.innerHeight - 470
      const doczone_style = {
        ...S('absolute w-100p h-' + doczone_height),
        overflow: 'scroll'
      }
      const drawer_header_style = S('bg-f7f9fa ml-5 br-3 p-12 font-18 color-4a4a4a')
      if (drawer.content === 'docs') {
        let doc_count
        if (attachments && attachments.length)
          doc_count = '(' + attachments.length + ')'
        drawer_content = (
          <div>
            <div style={ drawer_header_style }>Documents { doc_count }</div>
            <div className="text-center" style={ S('pt-30') }>
              <Dropzone style={ dropzone_style }
                onDragEnter={ this.handleDragEnter.bind(this) }
                onDragLeave={ this.handleDragLeave.bind(this) }
                onDrop={ this.drawerDrop.bind(this) }
              >
                <div style={ S('mb-10') }>
                  <img src="/images/dashboard/transactions/drag-n-drop.png"/>
                </div>
                <div style={ S('color-929292') }>
                  <span style={ S('font-16') }>DRAG & DROP</span><br />
                  <span style={ S('font-14 color-bfc2c3') }>your files to upload, or <a href="#">browse</a></span>
                </div>
              </Dropzone>
              <div style={ doczone_style }>
                { attachments_markup }
              </div>
            </div>
          </div>
        )
      }
      if (drawer.content === 'contacts') {
        drawer_content = (
          <div>
            <div style={ drawer_header_style }>Contacts</div>
            <div>
              {
                contacts.map((contact) => {
                  const contact_style = {
                    ...S('pt-15 pb-15 pl-15'),
                    borderBottom: '1px solid #f7f9fa'
                  }
                  return (
                    <div key={ 'contact-' + contact.id } style={ contact_style }>
                      <ProfileImage user={ contact }/>
                      <div style={ S('ml-50 ') }>
                        <div><b>{ contact.first_name } { contact.last_name }</b>, <span style={ S('color-929292') }>{ contact.roles[0] }</span></div>
                        <div style={ S('color-929292') }>
                          <div>{ contact.phone_number }{ contact.phone_number ? ' ,' : '' } <a style={{ textDecoration: 'none' }} href={ 'mailto:' + contact.email}>{ contact.email }</a></div>
                        </div>
                      </div>
                    </div>
                  )
                })
              }
            </div>
          </div>
        )
      }
    }

    let contacts_markup
    if (contacts) {
      contacts_markup = contacts.map(contact => {
        const contact_style = S('mb-20 mr-15 w-200 h-80')
        const info_style = {
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }
        return (
          <div className="pull-left" style={ contact_style } key={ 'contact-' + contact.id }>
            <ProfileImage user={ contact }/>
            <div style={ S('ml-50') }>
              <div><b>{ contact.first_name } { contact.last_name }</b></div>
              <div style={ S('color-929292') }>
                <div style={ info_style }>{ contact.roles[0] }</div>
                <div style={ info_style }>{ contact.phone_number }</div>
                <div style={ info_style }><a style={{ textDecoration: 'none' }} href={ 'mailto:' + contact.email}>{ contact.email }</a></div>
              </div>
            </div>
          </div>
        )
      })
    }
    const title_header_style = {
      ...S('h-80 mb-15 pl-15 pr-15'),
      borderBottom: '1px solid #edf1f3'
    }
    let overlay_active = ' hidden'
    if (transaction.drag_enter)
      overlay_active = ' active'
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
      current_file_image = <div style={ S('w-100 h-100 p-15') }><i style={ S('font-60') } className="fa fa-file-o"></i></div>
      if (current_file.type === 'image/jpeg')
        current_file_image = <div style={ S('bg-url(' + current_file.preview + ') bg-cover bg-center w-100 h-100') } src={ current_file.preview } />
    }
    // View more info
    let view_more_info_markup
    if (transaction.show_more_info) {
      let contract_price_area
      let association_fee_area
      if (transaction.contract_price) {
        contract_price_area = (
          <div style={ S('mb-15 mr-20 pull-left') }><b>Contract Price:</b> <span style={ S('color-929292') }>${ helpers.numberWithCommas(transaction.contract_price) }</span></div>
        )
      }
      if (transaction.listing.association_fee) {
        association_fee_area = (
          <div style={ S('mb-15 mr-20 pull-left') }><b>Association Fee:</b> <span style={ S('color-929292') }>${ helpers.numberWithCommas(transaction.listing.association_fee) }</span></div>
        )
      }
      view_more_info_markup = (
        <div>
          { contract_price_area }
          { association_fee_area }
        </div>
      )
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
    return (
      <div style={ S('minw-800 z-0') }>
        <Dropzone
          style={ S('w-100p h-100p') }
          disableClick
          onDragEnter={ this.handleDragEnter.bind(this) }
          onDragLeave={ this.handleDragLeave.bind(this) }
          onDrop={ this.handleAddDocs.bind(this) }
        >
          <div style={ S('mt-40 absolute r-10 z-100') }>
            <img onClick={ this.props.setDrawerContent.bind(this, 'contacts', false) } style={ S('w-30 h-30 mr-10 pointer') } src={ `/images/dashboard/icons/drawer/contacts${drawer && drawer.content === 'contacts' ? '-active' : ''}.svg`} />
            <img onClick={ this.props.setDrawerContent.bind(this, 'docs', false) } style={ S('w-30 h-30 mt-1n pointer') } src={ `/images/dashboard/icons/drawer/docs${drawer && drawer.content === 'docs' ? '-active' : ''}.svg`} />
          </div>
          <div style={ drawer_wrap_style }>
            <div style={ drawer_style } className={ 'transaction-detail__drawer ' + drawer_class }>
              <div onClick={ this.props.closeDrawer } style={ S('mt-5 mr-15 fw-400 font-32') }className="close pull-right">&times;</div>
              { drawer_content }
            </div>
          </div>
          <div className="transaction-detail__title" style={ title_header_style }>
            <div className="pull-left">
              <h4 style={ S('font-28') }>{ title_area }</h4>
            </div>
            { listing_status_indicator }
            <div className="pull-left text-center" style={ S('pointer bg-F7F9FA relative t-7 br-100 p-8 w-35 h-35') }>
              <img src="/images/dashboard/icons/link.svg"/>
            </div>
            <div className="clearfix"></div>
            <div style={ S('color-929394 mb-20') }>{ subtitle_area }</div>
          </div>
          <div style={ S('relative') }>
            <div style={ S('minh-380 pl-15 pr-15') }>
              <div style={ S(carousel_wh + ' mr-15 mb-30') } className="pull-left">
                { listing_images }
              </div>
              <div style={ S('w-500') } className="pull-left">
                <div style={ S('mb-10') }>
                  <div style={ S('mb-15 mr-20 pull-left') }><b>MLS#:</b> <span style={ S('color-929292') }>{ mls_number }</span></div>
                  <div style={ S('mb-15 mr-20 pull-left') }><b>Transaction Type:</b> <span style={ S('color-929292') }>{ transaction_type }</span></div>
                  <div style={ S('mb-15 mr-20 pull-left') }><b>Property Type:</b> <span style={ S('color-929292') }>{ property_type }</span></div>
                  <div style={ S('mb-15 mr-20 pull-left') }><b>Year Built:</b> <span style={ S('color-929292') }>{ year_built }</span></div>
                  <div style={ S('mb-15 mr-20 pull-left') }><b>Beds:</b> <span style={ S('color-929292') }>{ bedroom_count }</span></div>
                  <div style={ S('mb-15 mr-20 pull-left') }><b>Baths:</b> <span style={ S('color-929292') }>{ bathroom_count }</span></div>
                  <div style={ S('mb-15 mr-20 pull-left') }><b>Sqft:</b> <span style={ S('color-929292') }>{ square_feet }</span></div>
                  { view_more_info_markup }
                  <div className="clearfix"></div>
                </div>
                <div style={ S('mb-30') }>
                  <Button onClick={ this.handleViewMore.bind(this) } style={ S('bc-929292 color-929292 pl-20 pr-20 mr-15') }><b>View More</b></Button>
                  <Button onClick={ this.props.showEditModal.bind(this) } style={ S('bc-3388ff color-3388ff pl-40 pr-40 mr-15') }><b>Edit</b></Button>
                  <Button style={ S('pl-40 pr-40') } className={ data.deleting_transaction && data.deleting_transaction === transaction.id ? 'disabled' : '' } onClick={ this.props.deleteTransaction.bind(this, transaction.id) } type="button" bsStyle="danger">
                    { data.deleting_transaction && data.deleting_transaction === transaction.id ? 'Deleting...' : 'Delete' }
                  </Button>
                </div>
                <div>
                  { contacts_markup }
                </div>
              </div>
            </div>
          </div>
        </Dropzone>
        <div className={ 'dropzone__overlay' + overlay_active}>
          <div style={ S('w-100p h-100p text-center fixed t-0 l-0 z-1') } className="dropzone__bg"></div>
          <div style={ S('w-100p h-100p text-center fixed t-0 l-0 z-2') } className="flexbox dropzone--message">
            <div className="center-block" style={ S('relative p-20 mt-20p w-700 h-300 bg-fff br-2 color-929292') }>
              <div style={ S('absolute t-90 r-130n') }>
                <img src="/images/dashboard/transactions/drop-arrow.png"/>
              </div>
              <div style={ S('h-110 relative t-60n') }>
                <img src="/images/dashboard/transactions/drop-here.png"/>
              </div>
              <div style={ S('font-36 mb-10') }>Drop to add to <br/><span className="text-primary">{ title }</span></div>
              <div style={ S('font-20') }>Drop files like pdfs, word docs and images</div>
            </div>
          </div>
        </div>
        <Modal show={ data.show_document_modal } onHide={ this.props.hideModal.bind(this) }>
          <form onSubmit={ this.uploadFile.bind(this) }>
            <Modal.Header closeButton style={ S('h-45 bc-f3f3f3') }>
              <Modal.Title style={ S('font-14') }>Document { current_file_num } of { document_modal_file_count }</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div style={ S('mb-10') }>{ current_file_image }</div>
              <label>Document Title</label>
              <Input ref="file_name" onChange={ this.handleNameChange.bind(this) } value={ editing_name ? current_file_new_name : current_file_name } type="text" />
            </Modal.Body>
            <Modal.Footer>
              <Button bsStyle="link" onClick={ this.props.hideModal.bind(this) }>Cancel</Button>
              <Button style={ S('h-30 pt-5 pl-30 pr-30') } className={ data.creating_contacts ? 'disabled' : '' } type="submit" bsStyle="primary">
                { data.creating_contacts ? 'Uploading...' : 'Upload' }
              </Button>
            </Modal.Footer>
          </form>
        </Modal>
        <Modal dialogClassName="property-modal" show={ transaction.show_edit_modal } onHide={ this.props.hideModal.bind(this) }>
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
  handleViewMore: React.PropTypes.func,
  showEditModal: React.PropTypes.func,
  editTransaction: React.PropTypes.func
}