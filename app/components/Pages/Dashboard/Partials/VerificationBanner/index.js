import React from 'react'
import { connect } from 'react-redux'
import branch from 'recompose/branch'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'

import Brand from '../../../../../controllers/Brand'

const VerificationBanner = ({
  brand, isShow, email, onClickHandler
}) => {
  if (!isShow) {
    return <div />
  }

  return (
    <div
      className="c-verify-banner"
      style={{ background: `#${Brand.color('primary', '2196f3', brand)}` }}
    >
      <div className="c-verify-banner__content">
        {`To verify that it's you, please confirm your email ${email}`}
        <button className="c-verify-banner__close-btn" onClick={onClickHandler}>
          <svg
            fill="#fff"
            height="24"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            <path d="M0 0h24v24H0z" fill="none" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default compose(
  connect(({ brand }) => {
    let show = window.localStorage.getItem('verificationBanner')

    if (show == null) {
      window.localStorage.setItem('verificationBanner', 'show')
      show = true
    } else if (show === 'hide') {
      show = false
    }

    return {
      brand,
      show
    }
  }),
  withState('isShow', 'setIsShow', ({ show }) => show),
  withHandlers({
    onClickHandler: ({ setIsShow }) => () => {
      setIsShow(false)
      window.localStorage.setItem('verificationBanner', 'hide')
    }
  })
)(VerificationBanner)
