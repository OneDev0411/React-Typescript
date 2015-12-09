// Landing.js
import React, { Component } from 'react'
import { Link } from 'react-router'
import { Col, Input, Button } from 'react-bootstrap'
import S from 'shorti'

export default class Landing extends Component {

  render(){
    
    // Data
    const data = this.props.data
    
    // Styles
    const page_style = {
      position: 'relative',
      height: '100%',
      background: '#000',
      color: '#ffffff'
    }

    const navbar_style = {
      border: 'none',
      background: 'none'
    }
    const signin_btn_style = {
      ...S('color-fff w-130 p-10 pt-7 pb-7'),
      backgroundColor: 'transparent',
      border: '2px solid #fff'
    }
    const collapse_style = { 
      ...S('mt-20'), 
      border: 'none', 
      boxShadow: 'none'
    }
    const headline_style = {
      ...S('font-64 mb-35'),
      fontWeight: '100'
    }
    const tag_style = S('font-22 mb-40')
    const form_wrap_style = {
      ...S('br-4 p-30 pb-20 maxw-650'),
      'backgroundColor': 'rgba(0, 0, 0, 0.5)'
    }
    const footer_style = {
      ...S('absolute b-0 w-100p mb-20 pt-20 color-ededed font-13  z-2'),
      borderTop: '1px solid rgba(168,168,168, 0.3)'
    }

    let random_num = Math.round(Math.random())
    let video_src = 'young_agent'
    let headline_text = (
      <div>
        Be a #superagent<span className="blinking-cursor">|</span>
      </div>
    )

    if(random_num === 1){
      const second_tag_style = {
        ...S('font-22 mt-20'),
        lineHeight: '28px',
        fontStyle: 'italic'
      }
      video_src = 'couple'
      headline_text = (
        <div>
          From Search to Close be<br/><p style={ second_tag_style }>smarter, faster, more responsive, more knowledgable</p> 
        </div>
      )
    }

    let video = (
      <video style={ S('z-0 absolute') } autoPlay="true" loop="true" className="fullscreen-bg__video">
        <source src={'/videos/landing/' + video_src + '.webm'} type="video/webm"/>
        <source src={'/videos/landing/' + video_src + '.mp4'} type="video/mp4"/>
        <source src={'/videos/landing/' + video_src + '.ogv'} type="video/ogg"/>
      </video>
    )
    return (
      <div className="landing-page" style={ page_style }>
        <div className="overlay"></div>
        { video }
        <header style={ S('absolute w-100p z-3') }>
          <nav className="navbar navbar-default" style={ navbar_style }>
            <div className="container-fluid">
              <div className="navbar-header">
                <button style={ S('mt-15') } type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#main-link" aria-expanded="false">
                  <span className="sr-only">Toggle navigation</span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                </button>
                <div className="pull-left" style={ S('mt-20 ml-0') }><img style={ S('w-24') } src="images/landing/logo@2x.png" /></div>
                <div className="tk-calluna-sans pull-left" style={ S('font-28 ml-10 mt-12 color-fff') }>Rechat</div>
              </div>

              <div style={ collapse_style } className="collapse navbar-collapse text-center" id="main-link">
                <ul className="nav navbar-nav navbar-right">
                  <li className="contact-us-btn" style={ S('mr-20') }>
                    <a href="#" style={ S('color-fff relative t-6n') }>Contact Us</a>
                  </li>
                  <li>
                    <a className="btn btn-default center-block" href="/signin" style={ signin_btn_style }>Sign in</a>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </header>
        <main className="container" style={ S('h-100p z-2 relative') }>
          <div className="landing-main text-center" style={ S('h-100p') }>
            <div className="center-block" style={ S('maxw-700 mt-50n') }>
              <h1 className="tempo" style={ headline_style }>
                { headline_text }
              </h1>
              <p style={ tag_style }>
                Rechat is a crossplatform service that connects you to a million goats.<br className="hidden-xs"/>
                Get on the waiting list! We will notifiy you when we launch.
              </p>
              <div className="form-wrap center-block" style={ form_wrap_style }>
                <form>
                  <Col className="form-input--email" sm={8} style={ S('pl-0') }>
                    <Input style={ S('w-100p') } bsSize="large" type="text" placeholder="Email Address"/>
                  </Col>
                  <Col sm={4} style={ S('pl-0 pr-0') }>
                    <Button style={ S('w-100p') } bsStyle="primary" bsSize="large" type="submit">Notify Me!</Button>
                  </Col>
                </form>
                <div className="clearfix"></div>
              </div>
            </div>
          </div>
        </main>
        <footer style={ footer_style }>
          <div className="container">
            <Col className="footer-text footer-text--left" sm={6}>
              Made with <img src="/images/landing/heart.png" /> by Rechat | <a style={ S('color-ededed') } href="/">Contact Us</a>
            </Col>
            <Col className="footer-text footer-text--right" sm={6}>
              Rechat Inc. &copy; 2015. All Rights Reserved. <a style={ S('color-ededed') } href="/terms/mls">MLS Terms</a>
            </Col>
          </div>
        </footer>
      </div>

    )
  }
}