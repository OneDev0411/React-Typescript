// Dashboard/Transactions/Drawer.js
import React, { Component } from 'react'
import { Button, ProgressBar } from 'react-bootstrap'
import S from 'shorti'
import _ from 'lodash'
import Dropzone from 'react-dropzone'
import helpers from '../../../../../../utils/helpers'
// Partials
import Loading from '../../../../../Partials/Loading'
import ProfileImage from '../../../Partials/ProfileImage'
import AddContactsModule from '../../../Modules/AddContacts'

export default class Drawer extends Component {

  openFileViewer(file) {
    this.props.openFileViewer(file)
  }

  render() {
    // Data
    const data = this.props.data
    const user = data.user
    const contacts = data.contacts
    const transaction = data.current_transaction
    const drawer = transaction.drawer
    const roles = transaction.roles
    const attachments = transaction.attachments
    let drawer_content
    const drawer_height = window.innerHeight - 203
    let drawer_wrap_style = {
      ...S('z-101 absolute h-' + drawer_height + ' r-0 w-0 t-79'),
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
          // console.log(file)
          let mime
          if (file.info)
            mime = file.info.mime
          switch (mime) {
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
          if (file.info && mime === 'image/jpeg' || file.info && mime === 'image/png' || file.info && mime === 'image/gif') {
            file_image = (
              <a href={ file.preview } target="_blank" className="pull-left" style={ S('w-60 h-60 ml-10 bg-url(' + file.url + ') bg-cover bg-center br-2') }></a>
            )
          }
          const file_style = {
            ...S('h-80 pb-10 pt-10 color-929292 pointer'),
            borderBottom: '1px solid #f7f9fa'
          }
          const created = helpers.friendlyDate(file.created_at)
          const created_string = `${created.day}, ${created.month} ${created.date}, ${created.year}`
          const added_by = file.user
          let user_string
          if (added_by === user.id)
            user_string = user.first_name
          else {
            const user_object = _.find(contacts, { id: added_by })
            if (user_object)
              user_string = user_object.first_name
          }
          let file_area = (
            <div>
              <Button onClick={ this.props.deleteFile.bind(this, file) } style={ S('mt-10 mr-10 absolute r-0') } bsStyle="danger" className={ file.is_deleting ? 'delete disabled' : 'delete' }>
                { file.is_deleting ? 'Deleting...' : 'Delete' }
              </Button>
              <div onClick={ this.openFileViewer.bind(this, file) } className="pull-left">
                { file_image }
              </div>
              <div onClick={ this.openFileViewer.bind(this, file) } style={ S('w-350') } className="pull-left text-left">
                <div style={ S('ml-10 color-444 font-14 mb-5') }>{ file.info ? file.info.title : '' }</div>
                <div style={ S('w-150 ml-10 font-12') }>{ created_string } - { user_string }</div>
                <div style={ S('w-150 ml-10 font-12') }>Shared with Shayan</div>
              </div>
            </div>
          )
          if (file.uploading) {
            let upload_percent = 0
            if (file.upload_percent)
              upload_percent = file.upload_percent
            file_area = (
              <div style={ S('ml-20 mr-20 mt-10') }>
                <div style={ S('relative t-10n') }>Uploading { file.new_name || file.name }</div>
                <div>
                  <ProgressBar active striped bsStyle="success" now={ upload_percent } />
                </div>
              </div>
            )
          }
          return (
            <div className="transaction-file" key={ 'file-' + i } style={ file_style }>
              { file_area }
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
      const drawer_header_style = S('relative z-2 bg-f7f9fa ml-5 br-3 p-12 font-18 color-4a4a4a')
      // Docs
      if (drawer.content === 'docs') {
        let doc_count
        if (attachments && attachments.length)
          doc_count = '(' + attachments.length + ')'
        drawer_content = (
          <div>
            <div style={ drawer_header_style }>Documents { doc_count }</div>
            <div className="text-center" style={ S('pt-30') }>
              <Dropzone style={ dropzone_style }
                onDragEnter={ this.props.handleDragEnter.bind(this) }
                onDragLeave={ this.props.handleDragLeave.bind(this) }
                onDrop={ this.props.drawerDrop.bind(this) }
              >
                <div style={ S('mb-10') }>
                  <img src="/static/images/dashboard/transactions/drag-n-drop.png"/>
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
      // Contacts
      if (drawer.content === 'contacts' && roles) {
        let contacts_list
        if (roles) {
          contacts_list = roles.map(role => {
            const contact = role.contact
            const contact_style = {
              ...S('pt-15 pb-15 pl-15'),
              borderBottom: '1px solid #f7f9fa'
            }
            let delete_text = 'Delete'
            let deleting_class = ''
            if (transaction.deleting_contact && transaction.deleting_contact.id === contact.id) {
              delete_text = 'Deleting...'
              deleting_class = ' disabled'
            }
            let delete_button
            if (roles.length > 1) {
              delete_button = (
                <Button onClick={ this.props.deleteContact.bind(this, contact) } style={ S('mr-10 absolute r-0') } bsStyle="danger" className={ 'delete' + deleting_class }>
                  { delete_text }
                </Button>
              )
            }
            return (
              <div className="transaction-contact" key={ 'contact-' + contact.id } style={ contact_style }>
                { delete_button }
                <ProfileImage data={ data } user={ contact }/>
                <div style={ S('ml-50 ') }>
                  <div><b>{ contact.first_name } { contact.last_name }</b>, <span style={ S('color-929292') }>{ contact.roles ? contact.roles[0] : '' }</span></div>
                  <div style={ S('color-929292') }>
                    <div>{ contact.phone_number }{ contact.phone_number ? ',' : '' } <a style={{ textDecoration: 'none' }} href={ 'mailto:' + contact.email}>{ contact.email }</a></div>
                  </div>
                </div>
              </div>
            )
          })
        }
        drawer_content = (
          <div>
            <div style={ drawer_header_style }>Contacts</div>
            <div>
              { contacts_list }
            </div>
            <AddContactsModule
              data={ data }
              module_type="transaction"
            />
          </div>
        )
      }
      // Map
      if (drawer.content === 'map') {
        let google_address
        if (transaction.listing && transaction.listing.property)
          google_address = transaction.listing.property.address.geo_source_formatted_address_google
        drawer_content = (
          <div>
            <div style={ drawer_header_style }>Map</div>
            <div>
              <div style={ S('absolute w-100p z-0') }>
                <Loading />
              </div>
              <div style={ S('absolute z-1 t-50n') }>
                <iframe
                  width="500"
                  height={ window.innerHeight - 152 }
                  frameBorder="0" style={ { border: 0 } }
                  src={ 'https://www.google.com/maps/embed/v1/place?key=AIzaSyDagxNRLRIOsF8wxmuh1J3ysqnwdDB93-4&q=' + google_address }
                  allowFullScreen
                >
                </iframe>
              </div>
            </div>
          </div>
        )
      }
    }
    return (
      <div style={ drawer_wrap_style }>
        <div style={ drawer_style } className={ 'drawer ' + drawer_class }>
          <div onClick={ this.props.closeDrawer } style={ S('mt-5 mr-15 fw-400 font-32 relative z-3') }className="close pull-right">&times;</div>
          { drawer_content }
        </div>
      </div>
    )
  }
}

// PropTypes
Drawer.propTypes = {
  data: React.PropTypes.object,
  closeDrawer: React.PropTypes.func,
  deleteFile: React.PropTypes.func,
  handleDragEnter: React.PropTypes.func,
  handleDragLeave: React.PropTypes.func,
  drawerDrop: React.PropTypes.func,
  openFileViewer: React.PropTypes.func,
  deleteContact: React.PropTypes.func
}
