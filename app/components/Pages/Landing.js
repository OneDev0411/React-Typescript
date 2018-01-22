// Landing.js
import React, { Component } from 'react'
import { Link } from 'react-router'
import {
  Col,
  FormControl,
  Button,
  OverlayTrigger,
  Popover
} from 'react-bootstrap'
import S from 'shorti'
import validator from 'validator'
import { randomString } from '../../utils/helpers'

import emojify from 'emojify.js'
emojify.setConfig({
  img_dir: '/static/images/emoji'
})
import AppDispatcher from '../../dispatcher/AppDispatcher'
import AppStore from '../../stores/AppStore'
import Brand from '../../controllers/Brand'
import MobileSplashViewer from '../Partials/MobileSplashViewer'

export default class Landing extends Component {
  componentDidMount() {
    AppStore.data.blinking_cursor = true
    AppStore.data.animation_started = true
    AppStore.data.current_text = 'smarter'
    AppStore.emitChange()
    setTimeout(() => {
      AppDispatcher.dispatch({
        action: 'landing-text-animation'
      })
    }, 3000)
  }
  componentDidUpdate() {
    const data = this.props.data
    if (data.errors && data.errors.type === 'email-in-use') {
      const email = data.signup_email
      window.location.href = `/signin?email=${encodeURIComponent(email)}`
    }
  }
  toggleNavBarLinks() {
    if (AppStore.data.navbar_in) {
      delete AppStore.data.navbar_in
    } else {
      AppStore.data.navbar_in = true
    }
    AppStore.emitChange()
  }
  render() {
    // Data
    const data = this.props.data
    let blinking_cursor = AppStore.data.blinking_cursor
    let video_src = AppStore.data.video_src
    if (!video_src) {
      video_src = 'young_agent'
    }
    let current_text = data.initial_text
    if (AppStore.data.animation_started) {
      current_text = AppStore.data.current_text
    }
    // Blinking cursor
    if (typeof blinking_cursor === 'undefined') {
      blinking_cursor = true
    }
    if (blinking_cursor) {
      blinking_cursor = 'blinking-cursor'
    } else {
      blinking_cursor = ''
    }

    // Content from data props
    // Styles
    const page_style = {
      height: '100vh',
      background: '#000',
      color: '#ffffff'
    }
    const navbar_style = {
      border: 'none',
      background: 'none'
    }
    const collapse_style = {
      ...S('mt-20'),
      border: 'none',
      boxShadow: 'none'
    }
    const headline_style = S('mb-35')
    const footer_style = {
      ...S('absolute b-0 w-100p mb-20 pt-20 color-ededed font-13  z-2'),
      borderTop: '1px solid rgba(168,168,168, 0.3)'
    }
    const current_text_style = {
      fontStyle: 'italic'
    }
    // Get video and text from random number
    const headline_text = (
      <div>
        From search to close be<br />
        <span style={current_text_style}>{current_text}</span>
        <span className={blinking_cursor}>|</span>
      </div>
    )
    const video = (
      <video
        style={S('z-0 absolute')}
        autoPlay="true"
        loop="true"
        className="fullscreen-bg__video"
      >
        <source
          src={`/static/videos/landing/${video_src}.webm`}
          type="video/webm"
        />
        <source
          src={`/static/videos/landing/${video_src}.mp4`}
          type="video/mp4"
        />
        <source
          src={`/static/videos/landing/${video_src}.ogv`}
          type="video/ogg"
        />
      </video>
    )
    let login_btn_li_style
    let login_btn_style
    let signup_input_style = {
      ...S('h-37'),
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0
    }
    const signup_btn_style = {
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0
    }
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      login_btn_style = ' w-100p'
      login_btn_li_style = S('pl-15 pr-15')
      signup_input_style = {
        ...signup_input_style,
        width: window.innerWidth - 125
      }
    }

    let brand_logo
    if (Brand.asset('site_logo_wide')) {
      brand_logo = (
        <div style={{ ...S('ml-15 inline-block'), textDecoration: 'none' }}>
          <span
            style={S(
              `inline-block font-30 mr-15 relative t-1n color-${Brand.color(
                'primary'
              )}`
            )}
          >
            +
          </span>
          <img
            style={S('w-200 relative t-3n')}
            src={Brand.asset('site_logo_wide')}
          />
        </div>
      )
    }
    let mobile_splash_viewer
    if (data.show_mobile_splash_viewer) {
      mobile_splash_viewer = <MobileSplashViewer data={data} />
    }
    return (
      <div className="page-landing page-bg-video" style={page_style}>
        <div className="overlay" />
        {video}
        <header style={S('absolute w-100p z-3')}>
          <nav className="navbar navbar-default" style={navbar_style}>
            <div className="container-fluid">
              <div className="navbar-header">
                <button
                  onClick={this.toggleNavBarLinks.bind(this)}
                  style={S('mt-15')}
                  type="button"
                  className="navbar-toggle collapsed"
                  data-toggle="collapse"
                  aria-expanded={data.navbar_in ? 'true' : 'false'}
                >
                  <span className="sr-only">Toggle navigation</span>
                  <span className="icon-bar" />
                  <span className="icon-bar" />
                  <span className="icon-bar" />
                </button>
                <div
                  className="tk-calluna-sans pull-left"
                  style={S('font-28 mt-12 color-fff')}
                >
                  Rechat
                  {brand_logo}
                </div>
              </div>
              <div
                style={collapse_style}
                className={`collapse navbar-collapse text-center${data.navbar_in
                  ? ' in'
                  : ''}`}
              >
                {data && data.user ? (
                  <ul className="nav navbar-nav navbar-right">
                    <li style={{ marginRight: '20px' }}>
                      <Link
                        className="btn btn-default"
                        to="/dashboard/mls"
                        style={S(
                          'color-fff border-1-solid-a1bde4 bg-a1bde4 w-80 p-7 w-100'
                        )}
                      >
                        DASHBOARD
                      </Link>
                    </li>
                  </ul>
                ) : (
                  <ul className="nav navbar-nav navbar-right">
                    <li style={{ marginRight: '20px' }}>
                      <Link
                        className="btn btn-default"
                        to="/signin"
                        style={S(
                          `color-fff border-1-solid-a1bde4 bg-a1bde4 w-80 p-7 mr-15${login_btn_style}`
                        )}
                      >
                        SIGN IN
                      </Link>
                    </li>
                    <li style={login_btn_li_style}>
                      <Link
                        className="btn btn-default"
                        to="/signup"
                        style={S(
                          `color-fff border-1-solid-a1bde4 bg-a1bde4 w-80 p-7 mr-15${login_btn_style}`
                        )}
                      >
                        SIGN UP
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
            </div>
          </nav>
        </header>
        <main className="container" style={S('h-100p z-2 relative')}>
          <div className="landing-main text-center" style={S('h-100p')}>
            <div className="center-block" style={S('maxw-750 mt-50n')}>
              <h1 className="tempo headline" style={headline_style}>
                {headline_text}
              </h1>
            </div>
          </div>
        </main>
        <footer className="footer" style={footer_style}>
          <div className="container">
            <Col className="footer-text footer-text--left" sm={6}>
              Made with{' '}
              <img src="/static/images/landing/heart.png" alt="love" /> by
              Rechat | <a href="mailto:support@rechat.com">Contact Us</a>
            </Col>
            <Col className="footer-text footer-text--right" sm={6}>
              Rechat Inc. &copy; {new Date().getFullYear()}. All Rights
              Reserved. <a href="/terms">Terms of Service</a> |{' '}
              <a href="/terms/mls">MLS Terms</a> |{' '}
              <a href="/privacy">Privacy Policy</a>
            </Col>
          </div>
        </footer>
        {mobile_splash_viewer}
      </div>
    )
  }
}