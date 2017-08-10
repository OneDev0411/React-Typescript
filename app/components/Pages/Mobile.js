// MobileSplashViewer.js
import React, { Component } from 'react'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import pure from 'recompose/pure'
import { Button } from 'react-bootstrap'
import S from 'shorti'
import MobileSplashController from '../../controllers/MobileSplashController'
import Brand from '../../controllers/Brand'

const Mobile = ({ data }) => {
  const mobile_splash_style = S(
    'absolute t-0 z-1000 l-0 w-100p h-100p bg-000 color-fff bg-url(/static/images/mobile/mask@3x.jpg) bg-center bg-cover'
  )

  let logo = '/static/images/mobile/icon@3x.png'
  if (data.brand) {
    logo = Brand.asset('site_logo')
  }

  return (
    <div style={mobile_splash_style}>
      <div style={S('bg-263445 absolute t-0 l-0 w-100p h-100p op-.7 z-9')} />
      <div style={S('color-fff z-10 relative text-center')}>
        <div style={S('mt-50 mb-30')}>
          <img style={S('w-76')} src={logo} />
        </div>
        {data.location && data.location.query.type === 'iphone'
          ? <div>
            <p style={{ fontSize: '18px', padding: '2rem' }}>
                Our mobile web version is temporarily unavailable.  Please use your desktop browser to access Rechat.com or use the mobile iOS App.
              </p>
            <Button
              style={S(
                  `color-fff border-1-solid-${Brand.color(
                    'primary',
                    '3388ff'
                  )} bg-${Brand.color('primary', '3388ff')}`
                )}
              bsSize="large"
              onClick={MobileSplashController.goToBranchLink}
            >
                Open in my Rechat App
              </Button>
          </div>
          : <div style={{ fontSize: '18px', padding: '2rem' }}>
              Our mobile web version is temporarily unavailable.  Please use your desktop browser to access Rechat.com.
            </div>}
      </div>
      <div style={S('text-center color-fff absolute w-100p b-30 z-11')}>
        Powered by{' '}
        <span className="din" style={S('fw-600')}>
          Rechat<sup>TM</sup>
        </span>
      </div>
    </div>
  )
}

export default compose(pure, connect(({ data }) => ({ data })))(Mobile)
