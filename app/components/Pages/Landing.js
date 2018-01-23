// Landing.js
import React, { Component } from 'react'
import { Link } from 'react-router'
import { Col } from 'react-bootstrap'
import S from 'shorti'
import Typist from 'react-typist'
import emojify from 'emojify.js'

emojify.setConfig({
  img_dir: '/static/images/emoji'
})
import AppStore from '../../stores/AppStore'
import Brand from '../../controllers/Brand'
import MobileSplashViewer from '../Partials/MobileSplashViewer'

export default class Landing extends Component {
  constructor(props) {
    super(props)
    this.state = {
      renderTypest: true
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
  onHeaderTyped = () => {
    this.setState({ renderTypest: false })
    setTimeout(() => {
      this.setState({ renderTypest: true })
    }, 100)
  }
  render() {
    // Data
    const { renderTypest } = this.state
    const animated_text = [
      'smarter',
      'faster',
      'more responsive',
      'more knowledgeable'
    ]

    const { data } = this.props


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
    // Get video and text from random number
    const headline_text = (
      <div>
        From search to close be<br />
        {renderTypest && (
          <Typist onTypingDone={this.onHeaderTyped}>
            {animated_text.map(text => (
              <span key={text}>
                <Typist.Delay ms={1000} />
                {text}
                <Typist.Delay ms={1000} />

                <Typist.Backspace count={text.length} delay={1000} />
              </span>
            ))}
          </Typist>
        )}
      </div>
    )
    const video = (
      <video
        style={S('z-0 absolute')}
        autoPlay="true"
        loop="true"
        className="fullscreen-bg__video"
      >
        <source src="/static/videos/landing/young_agent.webm" type="video/webm" />
        <source src="/static/videos/landing/young_agent.mp4" type="video/mp4" />
        <source src="/static/videos/landing/young_agent.ogv" type="video/ogg" />
      </video>
    )
    let login_btn_li_style
    let login_btn_style

    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      login_btn_style = ' w-100p'
      login_btn_li_style = S('pl-15 pr-15')
    }

    let brand_logo

    if (Brand.asset('site_logo_wide')) {
      brand_logo = (
        <div style={{ ...S('ml-15 inline-block'), textDecoration: 'none' }}>
          <span
            style={S(`inline-block font-30 mr-15 relative t-1n color-${Brand.color('primary')}`)}
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
                className={`collapse navbar-collapse text-center${
                  data.navbar_in ? ' in' : ''
                }`}
              >
                {data && data.user ? (
                  <ul className="nav navbar-nav navbar-right">
                    <li style={{ marginRight: '20px' }}>
                      <Link
                        className="btn btn-default"
                        to="/dashboard/mls"
                        style={S('color-fff border-1-solid-a1bde4 bg-a1bde4 w-80 p-7 w-100')}
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
                        style={S(`color-fff border-1-solid-a1bde4 bg-a1bde4 w-80 p-7 mr-15${login_btn_style}`)}
                      >
                        SIGN IN
                      </Link>
                    </li>
                    <li style={login_btn_li_style}>
                      <Link
                        className="btn btn-default"
                        to="/signup"
                        style={S(`color-fff border-1-solid-a1bde4 bg-a1bde4 w-80 p-7 mr-15${login_btn_style}`)}
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
              Made with <img src="/static/images/landing/heart.png" alt="love" /> by
              Rechat | <a href="mailto:support@rechat.com">Contact Us</a>
            </Col>
            <Col className="footer-text footer-text--right" sm={6}>
              Rechat Inc. &copy; {new Date().getFullYear()}. All Rights Reserved.{' '}
              <a href="/terms">Terms of Service</a> |{' '}
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
