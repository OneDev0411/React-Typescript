// Dashboard/Mls/Partials/ShareTypeModal.js
import React, { Component } from 'react'
import S from 'shorti'
import { Button, Modal, Input } from 'react-bootstrap'
import controller from '../../controller'
import listing_util from '../../../../../utils/listing'
export default class ShareTypeModal extends Component {
  componentDidMount() {
    if (this.refs.title)
      this.refs.title.refs.input.focus()
  }
  saveForMe() {
    const title = this.refs.title.refs.input.value.trim()
    controller.alert_share.saveForMe(title)
  }
  showShareModal() {
    const title = this.refs.title.refs.input.value.trim()
    controller.alert_share.showShareModal(title)
  }
  render() {
    const data = this.props.data
    const share_modal = data.share_modal
    const listing_map = data.listing_map
    const alert = data.listing_map.options
    if (share_modal && share_modal.error) {
      const warning_style = {
        ...S('absolute r-260 t-90 bg-fff w-347 h-210 border-1-solid-d7d6d6 text-center p-30 z-10'),
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.12), 0 0 4px 0 rgba(0, 0, 0, 0.1)'
      }
      return (
        <div style={ warning_style }>
          <div className="din" style={ S('font-26 color-fe3824 mb-10') }>TOO MANY LISTINGS!</div>
          <div style={ S('font-15 mb-20') }>
            We allow up to <strong>200</strong> listings per alert.<br />
            You have <strong>{ listing_map.listings_info.total }</strong> in your search right now.<br />
            Please either zoom in or add more filters.
          </div>
          <div onClick={ controller.listing_map.hideModal } style={ S('font-17 color-9b9b9b pointer') }>Close</div>
        </div>
      )
    }
    return (
      <Modal dialogClassName={ data.is_mobile ? 'modal-mobile' : 'modal-share-type' } show={ listing_map && listing_map.show_share_type_modal } onHide={ controller.listing_map.hideModal }>
        <Modal.Body style={ S('p-0') }>
          <div className="din" style={ S('bg-52ABF1 h-200 font-32 color-fff text-center') }>
            <div style={ S('pt-20 pb-10 text-center w-100p') }>
              <img style={ S('w-60') } src="/images/dashboard/mls/alert-bell.svg"/>
            </div>
            Get new listings faster<br />
            than your local MLS®
          </div>
          <div style={ S('p-15') }>
            <div style={ S('mb-10') }>
              Name Your Alert
            </div>
            <div>
              <Input ref="title" type="text" placeholder={ listing_util.alertOptionsShort(alert) }/>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer style={ { ...S('bg-f8f8f8 relative p-0'), borderBottomLeftRadius: '3px', borderBottomRightRadius: '3px' } }>
          <div style={ S('pointer color-2196f3 p-15 pl-25') } className={`pull-left${ share_modal && share_modal.saving ? ' disabled' : '' }`} onClick={ this.saveForMe.bind(this) }>
            { share_modal && share_modal.saving ? 'Saving...' : 'Save For Me' }
          </div>
          <div style={ S('pointer color-2196f3 p-15 pr-25') } className="pull-right" onClick={ this.showShareModal.bind(this) }>Save &amp; Share</div>
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