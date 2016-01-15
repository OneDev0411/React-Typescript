// Dashboard/Transactions/TransactionDetail.js
import React, { Component } from 'react'
import { Carousel, CarouselItem, Modal, Button, Input } from 'react-bootstrap'
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

  render() {
    const data = this.props.data
    const transaction = data.current_transaction
    const listing = transaction.listing
    const listing_data = transaction.listing_data
    const drawer = transaction.drawer
    const attachments = transaction.attachments
    let property
    if (listing)
      property = listing.property
    let title = 'No address'
    let subtitle
    if (property) {
      title = `${property.address.street_number} ${property.address.street_name} ${property.address.street_suffix}`
      subtitle = `${property.address.street_number} ${property.address.street_name} ${property.address.street_suffix} ${property.address.city}, ${property.address.state} ${property.address.postal_code}`
    }
    if (listing_data) {
      property = listing_data.property
      title = `${property.address.street_full}`
      subtitle = `${property.address.street_full} ${property.address.city}, ${property.address.state} ${property.address.postal_code}`
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
    let divider_div
    let carousel_wh = 'w-480 h-300'
    if (drawer && window.innerWidth <= 1700) {
      divider_div = (
        <div className="clearfix"></div>
      )
      if (window.innerWidth >= 1200) {
        const carousel_width = window.innerWidth - 750
        const carousel_height = carousel_width / 1.75
        carousel_wh = 'w-' + carousel_width + ' h-' + carousel_height
      }
    }
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
    let mls_number
    let price_area
    let transaction_type
    let property_type
    let year_built
    let bedroom_count
    let bathroom_count
    if (listing) {
      mls_number = listing.mls_number
      transaction_type = listing.transaction_type
    }
    if (property) {
      property_type = property.property_type
      year_built = property.year_built
      bedroom_count = property.bedroom_count
      bathroom_count = property.bathroom_count
      if (transaction.contract_price) {
        price_area = (
          <span style={ S('color-929394 fw-400') }>${ helpers.numberWithCommas(transaction.contract_price) }</span>
        )
      }
    }

    let square_feet
    if (property)
      square_feet = helpers.numberWithCommas(Math.floor(listing_util.metersToFeet(property.square_meters)))

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
    const contacts = transaction.contacts
    const no_border = { border: 'none' }

    // Drawer
    let drawer_content
    const drawer_height = window.innerHeight - 203
    let drawer_wrap_style = {
      ...S('absolute h-' + drawer_height + ' r-0 w-0 t-80'),
      overflow: 'hidden'
    }
    const drawer_style = {
      ...S('absolute h-' + drawer_height + ' z-100 bg-fff w-500'),
      borderLeft: '1px solid #edf1f3'
    }
    let drawer_class
    if (drawer) {
      drawer_wrap_style = {
        ...drawer_wrap_style,
        ...S('w-500')
      }
      drawer_class = 'active'
      const drawer_header_style = S('bg-f7f9fa p-12 font-18 color-4a4a4a')
      let attachments_markup
      // console.log(attachments)
      if (attachments) {
        attachments_markup = attachments.map((file, i) => {
          let file_image = (
            <a href={ file.preview } target="_blank" className="pull-left" style={ S('ml-10 w-60 h-60 color-929292') }>
              <i style={ S('font-50') } className="fa fa-file-o"></i>
              { file.type }
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
              <Button onClick={ this.props.deleteFile.bind(this, file) } style={ S('mt-10 mr-10') } bsStyle="danger" className="pull-right">Delete</Button>
              <div onClick={ this.openFile.bind(this, file) } className="pull-left">
                { file_image }
              </div>
              <div onClick={ this.openFile.bind(this, file) } style={ S('w-350') } className="pull-left text-left">
                <div style={ S('ml-20 color-444 font-15') }>{ file.new_name ? file.new_name : file.name }</div>
                <div style={ S('w-150 ml-20 font-13') }>Jan 15, 8:17am - Mark</div>
                <div style={ S('w-150 ml-20 font-13') }>Shared with Shayan</div>
              </div>
              <div className="clearfix"></div>
            </div>
          )
        })
      }
      const dropzone_style = {
        ...S('w-100p h-100p pb-15 mb-15'),
        borderBottom: '1px solid #f7f9fa'
      }
      const doczone_height = window.innerHeight - 470
      const doczone_style = {
        ...S('absolute w-100p h-' + doczone_height),
        overflow: 'scroll'
      }
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
            <Button style={ { ...no_border, ...S('br-100 w-35 h-35 p-2 mr-5') } } onClick={ this.props.setDrawerContent.bind(this, 'contacts') }>
              <img style={ S('w-20 h-20') } src={ `/images/dashboard/icons/drawer/contacts${drawer && drawer.content === 'contacts' ? '-active' : ''}.svg`} />
            </Button>
            <Button style={ { ...no_border, ...S('border-none br-100 w-35 h-35 p-2') } } onClick={ this.props.setDrawerContent.bind(this, 'docs') }>
              <img style={ S('w-15 h-15 mt-2n') } src={ `/images/dashboard/icons/drawer/docs${drawer && drawer.content === 'docs' ? '-active' : ''}.svg`} />
            </Button>
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
              { divider_div }
              <div style={ S('w-500') } className="pull-left">
                <div style={ S('mb-20') }>
                  <div style={ S('mb-15 mr-20 pull-left') }><b>MLS#:</b> <span style={ S('color-929292') }>{ mls_number }</span></div>
                  <div style={ S('mb-15 mr-20 pull-left') }><b>Transaction Type:</b> <span style={ S('color-929292') }>{ transaction_type }</span></div>
                  <div style={ S('mb-15 mr-20 pull-left') }><b>Property Type:</b> <span style={ S('color-929292') }>{ property_type }</span></div>
                  <div style={ S('mb-15 mr-20 pull-left') }><b>Year Built:</b> <span style={ S('color-929292') }>{ year_built }</span></div>
                  <div style={ S('mb-15 mr-20 pull-left') }><b>Beds:</b> <span style={ S('color-929292') }>{ bedroom_count }</span></div>
                  <div style={ S('mb-15 mr-20 pull-left') }><b>Baths:</b> <span style={ S('color-929292') }>{ bathroom_count }</span></div>
                  <div style={ S('mb-15 mr-20 pull-left') }><b>Sqft:</b> <span style={ S('color-929292') }>{ square_feet }</span></div>
                  <div className="clearfix"></div>
                </div>
                <div style={ S('mb-100') }>
                  <Button style={ S('bc-929292 color-929292 pl-20 pr-20 mr-15') }><b>View More</b></Button>
                  <Button style={ S('bc-3388ff color-3388ff pl-40 pr-40 mr-15') }><b>Edit</b></Button>
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
            <div className="center-block" style={ S('p-20 mt-20p w-700 h-300 bg-fff br-2 color-929292') }>
              <div style={ S('h-100 relative t-60n') }>
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
  handleNameChange: React.PropTypes.func
}