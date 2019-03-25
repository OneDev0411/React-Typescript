// Landing.js
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Col } from 'react-bootstrap'
import S from 'shorti'
import Typist from 'react-typist'

import Brand from '../../controllers/Brand'

import getDefaultHomePage from '../../utils/get-default-home-page'

const ANIMATED_TEXT = ['seamless', 'smarter', 'faster', 'more knowledgeable']

class Landing extends Component {
  constructor(props) {
    super(props)
    this.state = {
      renderTypest: true
    }
  }

  onTypingDone = () => {
    this.setState({ renderTypest: false })
    setTimeout(() => {
      this.setState({ renderTypest: true })
    }, 100)
  }

  render() {
    const { user } = this.props

    if (user) {
      window.location = getDefaultHomePage(user)
      return null
    }

    const { renderTypest } = this.state

    const BUTTON_STYLE = {
      backgroundColor: Brand.color('primary'),
      borderWidth: 0,
      color: '#fff',
      padding: '8px'
    }

    // Styles
    const page_style = {
      height: '100vh',
      background: '#000',
      color: '#ffffff'
    }
    const headline_style = S('mb-35')
    const footer_style = {
      ...S('absolute b-0 w-100p mb-20 pt-20 color-ededed font-13  z-2'),
      borderTop: '1px solid rgba(168,168,168, 0.3)'
    }
    // Get video and text from random number
    const headline_text = (
      <div>
        From search to close be
        <br />
        {renderTypest && (
          <Typist onTypingDone={this.onTypingDone}>
            {ANIMATED_TEXT.map(text => (
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
        <source
          src="/static/videos/landing/young_agent.webm"
          type="video/webm"
        />
        <source src="/static/videos/landing/young_agent.mp4" type="video/mp4" />
        <source src="/static/videos/landing/young_agent.ogv" type="video/ogg" />
      </video>
    )

    let brand_logo

    if (Brand.asset('site_logo_wide')) {
      brand_logo = (
        <div
          style={{
            ...S('ml-15 inline-block'),
            textDecoration: 'none'
          }}
        >
          <span
            style={{
              display: 'inline-block',
              fontSize: '30px',
              marginRight: '15px',
              position: 'relative',
              top: '-1px',
              color: Brand.color('primary')
            }}
          >
            +
          </span>
          <img
            alt="logo"
            style={S('w-200 relative t-3n')}
            src={Brand.asset('site_logo_wide')}
          />
        </div>
      )
    }

    return (
      <div className="page-landing page-bg-video" style={page_style}>
        <div className="overlay" />
        {video}
        <header>
          <div className="navbar-header">
            <div
              className="tk-calluna-sans pull-left"
              style={S('font-28 color-fff')}
            >
              Rechat
              {brand_logo}
            </div>
          </div>
          <div>
            <Link
              className="btn btn-default"
              to="/signin"
              style={{ ...BUTTON_STYLE, marginRight: '1em' }}
            >
              SIGN IN
            </Link>
            <Link
              className="btn btn-default"
              to="/signup"
              style={BUTTON_STYLE}
            >
              SIGN UP
            </Link>
          </div>
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
      </div>
    )
  }
}

export default connect(({ user }) => ({ user }))(Landing)
