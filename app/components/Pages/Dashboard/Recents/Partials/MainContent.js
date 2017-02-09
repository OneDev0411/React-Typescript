// MainContent.js
import React, { Component } from 'react'
import { ProgressBar } from 'react-bootstrap'
import S from 'shorti'
import RoomsList from './RoomsList'
import MessagesList from './MessagesList'
import Dropzone from 'react-dropzone'
import controller from '../../controller'

// Partials
import DropzoneOverlay from '../../Partials/DropzoneOverlay'
import ListingViewer from '../../Partials/ListingViewer'
import ListingViewerMobile from '../../Partials/ListingViewerMobile'
import CreateMessageArea from './CreateMessageArea'
import NewMessageViewer from './NewMessageViewer'
export default class MainContent extends Component {
  handleSearchRoomChange() {
    const search_rooms_input = this.refs.search_rooms_input.value
    this.props.filterRooms(search_rooms_input)
  }
  hideModal() {
    this.props.hideModal()
  }
  render() {
    // Data
    const data = this.props.data
    const main_style = S('absolute l-70 r-0')
    const rooms_column_style = {
      height: window.innerHeight,
      borderRight: '1px solid #e7e4e3',
      width: '340px'
    }
    const messages_column_style = {
      ...S('absolute l-340 minw-450'),
      height: window.innerHeight,
      width: window.innerWidth - 411
    }
    // Create message form
    let create_message_area = ''
    if (data.current_room) {
      create_message_area = (
        <CreateMessageArea
          data={ data }
          uploadFiles={ this.props.uploadFiles }
          createMessage={ this.props.createMessage }
          addContactToMessage={ this.props.addContactToMessage }
          handleContactFilterNav={ this.props.handleContactFilterNav }
          handleMessageTyping={ this.props.handleMessageTyping }
          handleContactFilter={ this.props.handleContactFilter }
        />
      )
    }
    let overlay_active
    let overlay_title = ''
    if (data.current_room) {
      overlay_active = data.current_room.overlay_active
      overlay_title = data.current_room.title
    }
    let uploading_area
    if (data.current_room && data.current_room.uploading_files) {
      let upload_percent = 0
      if (data.current_room.upload_percent)
        upload_percent = data.current_room.upload_percent
      let progress_bar_style = S('p-20 w-100p relative t-35n')
      if (data.is_mobile)
        progress_bar_style = S('p-20 w-100p absolute b-78 z-10')
      uploading_area = (
        <div style={ progress_bar_style }>
          <ProgressBar active striped bsStyle="success" now={ upload_percent } />
        </div>
      )
    }
    let listing_viewer
    if (data.show_listing_viewer) {
      listing_viewer = (
        <ListingViewer
          data={ data }
          listing={ data.current_listing }
          hideModal={ this.hideModal.bind(this) }
          navListingCarousel={ this.props.navListingCarousel }
          hideListingViewer={ this.props.hideListingViewer }
          showModalGallery={ this.props.showModalGallery }
          handleModalGalleryNav={ this.props.handleModalGalleryNav }
          showShareListingModal={ this.props.showShareListingModal }
        />
      )
      // Check for mobile
      if (data.is_mobile) {
        listing_viewer = (
          <ListingViewerMobile
            data={ data }
            listing={ data.current_listing }
            hideModal={ this.hideModal.bind(this) }
            navListingCarousel={ this.props.navListingCarousel }
            hideListingViewer={ this.props.hideListingViewer }
            showModalGallery={ this.props.showModalGallery }
            handleModalGalleryNav={ this.props.handleModalGalleryNav }
            showShareListingModal={ this.props.showShareListingModal }
          />
        )
      }
    }
    // Messages
    let messages_area = (
      <MessagesList
        data={ data }
        getPreviousMessages={ this.props.getPreviousMessages }
        showModal={ this.props.showModal.bind(this) }
        hideModal={ this.hideModal.bind(this) }
        showFileViewer={ this.props.showFileViewer }
        setHeadingDate={ this.props.setHeadingDate }
        removeScrollBottom={ this.props.removeScrollBottom }
        showListingViewer={ this.props.showListingViewer }
        changeListingNotification={ this.props.changeListingNotification }
        showAlertModal={ this.props.showAlertModal }
        hideAlertModal={ this.props.hideAlertModal }
        showDeleteRoomModal={ this.props.showDeleteRoomModal }
        hideDeleteRoomModal={ this.props.hideDeleteRoomModal }
        confirmDeleteRoom={ this.props.confirmDeleteRoom }
        setAlertGalleryActiveIndex={ this.props.setAlertGalleryActiveIndex }
      />
    )
    if (data.show_new_message_viewer) {
      messages_area = (
        <NewMessageViewer
          data={ data }
          addUsersToSearchInput={ this.props.addUsersToSearchInput }
          uploadFiles={ this.props.uploadFiles }
          createMessage={ this.props.createMessage }
          addContactToMessage={ this.props.addContactToMessage }
          handleContactFilterNav={ this.props.handleContactFilterNav }
          handleMessageTyping={ this.props.handleMessageTyping }
          handleContactFilter={ this.props.handleContactFilter }
          getPreviousMessages={ this.props.getPreviousMessages }
          showModal={ this.props.showModal.bind(this) }
          hideModal={ this.hideModal.bind(this) }
          showFileViewer={ this.props.showFileViewer }
          setHeadingDate={ this.props.setHeadingDate }
          removeScrollBottom={ this.props.removeScrollBottom }
          showListingViewer={ this.props.showListingViewer }
          changeListingNotification={ this.props.changeListingNotification }
          showAlertModal={ this.props.showAlertModal }
          hideAlertModal={ this.props.hideAlertModal }
          showDeleteRoomModal={ this.props.showDeleteRoomModal }
          hideDeleteRoomModal={ this.props.hideDeleteRoomModal }
          confirmDeleteRoom={ this.props.confirmDeleteRoom }
          setAlertGalleryActiveIndex={ this.props.setAlertGalleryActiveIndex }
          handleInputChange={ this.props.handleInputChange }
          handleCancelClick={ this.props.handleCancelClick }
        />
      )
    }
    // Mobile
    if (data.is_mobile) {
      if (data.show_listing_viewer) {
        return (
          <ListingViewerMobile
            data={ data }
            listing={ data.current_listing }
            hideModal={ controller.listing_map.hideModal }
            hideListingViewer={ controller.listing_viewer.hideListingViewer }
            showModalGallery={ controller.listing_viewer.showModalGallery }
            handleModalGalleryNav={ controller.listing_viewer.handleModalGalleryNav }
            showShareListingModal={ controller.listing_viewer.showShareListingModal }
          />
        )
      }
      if (!data.current_room_mobile && !data.show_new_message_viewer) {
        const main_style_mobile = S('w-' + window.innerWidth)
        return (
          <div style={ main_style_mobile }>
            <div style={ S('p-10 pt-15 h-60 relative') }>
              <img style={ S('w-12 h-12 absolute l-20 t-28') } src="/static/images/dashboard/chats/search.svg" />
              <input ref="search_rooms_input" onChange={ this.handleSearchRoomChange.bind(this) } style={ S('w-170 br-5 bg-f8fafb pl-30 h-34') } type="text" placeholder="Search" className="form-control pull-left" value={ data.search_rooms_input }/>
              <button onClick={ this.props.showNewMessageView.bind(this) } type="button" className="btn btn-primary" style={ S('h-34 pointer absolute p-0 pl-10 pr-10 t-14 r-10 br-100') }>
                <img src="/static/images/dashboard/chats/pencil.svg" style={ S('mr-10') }/>New Message
              </button>
              <div className="clearfix"></div>
            </div>
            <RoomsList
              setCurrentRoom={ this.props.setCurrentRoom }
              data={ data }
            />
          </div>
        )
      }
      const main_style_mobile = S('w-' + window.innerWidth)
      return (
        <div style={ main_style_mobile }>
          { messages_area }
          { uploading_area }
          { create_message_area }
        </div>
      )
    } // end mobile
    let clear_search_btn
    if (data.search_rooms_input) {
      clear_search_btn = (
        <div onClick={ this.props.clearRoomSearchText.bind(this) } className="close" style={ S('absolute l-230 t-23') }>&times;</div>
      )
    }
    return (
      <div>
        <Dropzone
          style={ S('w-100p h-100p') }
          disableClick
          onDragEnter={ this.props.handleDragEnter }
          onDragLeave={ this.props.handleDragLeave }
          onDrop={ this.props.uploadFiles }
        >
          <div style={ main_style }>
            <div className="dashboard__chat-rooms pull-left" style={ rooms_column_style }>
              <div style={ S('p-10 pt-12 h-60 relative bg-303e4d') }>
                <img style={ S('w-12 h-12 absolute l-20 t-23') } src="/static/images/dashboard/chats/search.svg" />
                { clear_search_btn }
                <input ref="search_rooms_input" onChange={ this.handleSearchRoomChange.bind(this) } style={ S('w-170 br-5 bg-4e5c6c color-8696a4 border-none pl-30 h-34') } type="text" placeholder="Search" className="form-control pull-left" value={ data.search_rooms_input } />
                <button onClick={ this.props.showNewMessageView.bind(this) } type="button" className="btn btn-primary" style={ S('pointer absolute t-12 r-10 br-5 pt-7 h-34') }>
                  <img src="/static/images/dashboard/chats/pencil.svg" style={ S('mr-10') }/>New Message
                </button>
                <div className="clearfix"></div>
              </div>
              <RoomsList
                setCurrentRoom={ this.props.setCurrentRoom }
                data={ data }
              />
            </div>
            <div className="dashboard__messages pull-left" style={ messages_column_style }>
              { messages_area }
              { uploading_area }
              { create_message_area }
            </div>
          </div>
        </Dropzone>
        <DropzoneOverlay
          overlay_active={ overlay_active }
          title={ overlay_title }
          context="room"
        />
        { listing_viewer }
      </div>
    )
  }
}

// PropTypes
MainContent.propTypes = {
  data: React.PropTypes.object,
  filterRooms: React.PropTypes.func.isRequired,
  showModal: React.PropTypes.func.isRequired,
  hideModal: React.PropTypes.func.isRequired,
  createMessage: React.PropTypes.func.isRequired,
  handleMessageTyping: React.PropTypes.func.isRequired,
  handleContactFilter: React.PropTypes.func.isRequired,
  handleContactFilterNav: React.PropTypes.func.isRequired,
  setCurrentRoom: React.PropTypes.func.isRequired,
  getPreviousMessages: React.PropTypes.func.isRequired,
  handleDragEnter: React.PropTypes.func.isRequired,
  handleDragLeave: React.PropTypes.func.isRequired,
  uploadFiles: React.PropTypes.func.isRequired,
  showFileViewer: React.PropTypes.func,
  setHeadingDate: React.PropTypes.func,
  removeScrollBottom: React.PropTypes.func,
  showListingViewer: React.PropTypes.func,
  changeListingNotification: React.PropTypes.func,
  navListingCarousel: React.PropTypes.func,
  addContactToMessage: React.PropTypes.func,
  hideListingViewer: React.PropTypes.func,
  showModalGallery: React.PropTypes.func,
  handleModalGalleryNav: React.PropTypes.func,
  showShareListingModal: React.PropTypes.func,
  showAlertModal: React.PropTypes.func,
  hideAlertModal: React.PropTypes.func,
  showDeleteRoomModal: React.PropTypes.func,
  hideDeleteRoomModal: React.PropTypes.func,
  confirmDeleteRoom: React.PropTypes.func,
  setAlertGalleryActiveIndex: React.PropTypes.func,
  clearRoomSearchText: React.PropTypes.func,
  showNewMessageView: React.PropTypes.func,
  addUsersToSearchInput: React.PropTypes.func,
  handleInputChange: React.PropTypes.func,
  handleCancelClick: React.PropTypes.func
}
