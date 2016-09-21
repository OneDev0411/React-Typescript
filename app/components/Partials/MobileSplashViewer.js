// MobileSplashViewer.js
import React, { Component } from 'react'
import { Button } from 'react-bootstrap'
import S from 'shorti'
import MobileSplashController from '../../controllers/MobileSplashController'
export default class MobileSplashViewer extends Component {
  render() {
    const mobile_splash_style = S('absolute t-0 z-10 l-0 w-100p h-100p bg-000 color-fff bg-url(/images/mobile/mask@3x.jpg) bg-center bg-cover')
    return (
      <div style={ mobile_splash_style }>
        <div style={ S('bg-263445 absolute t-0 l-0 w-100p h-100p op-.7 z-9') }></div>
        <div style={ S('color-fff z-10 relative text-center') }>
          <div style={ S('mt-50 mb-30') }>
            <img style={ S('w-76') } src="/images/mobile/icon@3x.png" />
          </div>
          <Button style={ S('mb-20') } bsSize="large" bsStyle="primary" onClick={ MobileSplashController.goToBranchLink }>Open in the Rechat App</Button>
          <div>
            <span style={ S('pointer') } onClick={ MobileSplashController.hideMobileSplashViewer }>Continue to mobile site</span>
          </div>
        </div>
      </div>
    )
  }
}