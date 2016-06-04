// Dashboard/Mls/Partials/ShareTypeModal.js
import React, { Component } from 'react'
import S from 'shorti'
import { Button, Modal, Input } from 'react-bootstrap'
import controller from '../../controller'
export default class ShareTypeModal extends Component {
  saveForMe() {
    const title = this.refs.title.refs.input.value
    controller.alert_share.saveForMe(title)
  }
  render() {
    const data = this.props.data
    const share_modal = data.share_modal
    const listing_map = data.listing_map
    if (share_modal && share_modal.error) {
      return (
        <Modal show={ listing_map && listing_map.show_share_type_modal } onHide={ controller.listing_map.hideModal }>
          <Modal.Header closeButton style={ S('border-bottom-1-solid-f8f8f8') }>
            <Modal.Title className="tempo" style={ S('font-36 ml-15') }>Share Alert</Modal.Title>
          </Modal.Header>
          <Modal.Body style={ S('p-30') }>
            Too many matches!  Please zoom in or set more filters.
          </Modal.Body>
          <Modal.Footer style={ S('bg-f8f8f8') }>
            <Button onClick={ controller.listing_map.hideModal } bsStyle="default">Ok</Button>
          </Modal.Footer>
        </Modal>
      )
    }
    return (
      <Modal dialogClassName="modal-share-type" show={ listing_map && listing_map.show_share_type_modal } onHide={ controller.listing_map.hideModal }>
        <Modal.Body style={ S('p-0') }>
          <div className="din" style={ S('bg-52ABF1 h-200 font-32 color-fff text-center') }>
            <div style={ S('pt-20 pb-10 text-center w-100p') }>
              <img style={ S('w-60') } src="/images/dashboard/mls/bell.png"/>
            </div>
            Get new listings faster<br />
            than your local MLS®
          </div>
          <div style={ S('p-15') }>
            <div>
              Name Your Alert
            </div>
            <div>
              <Input ref="title" type="text" placeholder="Alert title"/>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer style={ { ...S('bg-f8f8f8 relative p-0'), borderBottomLeftRadius: '3px', borderBottomRightRadius: '3px' } }>
          <div style={ S('pointer color-2196f3 p-15 pl-25') } className="pull-left" onClick={ this.saveForMe.bind(this) }>Save For Me</div>
          <div style={ S('pointer color-2196f3 p-15 pr-25') } className="pull-right" onClick={ controller.listing_map.showShareModal }>Save &amp; Share</div>
          <div style={ S('t-100 absolute text-center w-100p') }>
            <Button onClick={ controller.listing_map.hideModal } bsStyle="link" style={ S('font-40 bg-fff color-9b9b9b w-40 h-40 br-100 relative') }>
              <div style={ S('absolute t-12n l-9') }>&times;</div>
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    )
  }
}
ShareTypeModal.propTypes = {
  data: React.PropTypes.object
}