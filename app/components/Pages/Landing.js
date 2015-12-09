// Landing.js
import React, { Component } from 'react'
import { Link } from 'react-router'
import { Col, Input, Button } from 'react-bootstrap'
import S from 'shorti'

// Store
import AppStore from '../../stores/AppStore'

export default class Landing extends Component {

  startBlinking(){
    AppStore.data.blinking_cursor = true
    AppStore.emitChange()
  }

  stopBlinking(){
    AppStore.data.blinking_cursor = false
    AppStore.emitChange()
  }

  getText(animated_num){
    let animated_text = ['superagent','superbadass','goat','caitlynjenner']
    const data = this.props.data
    let random_number = data.random_number
    if(random_number)
      animated_text = ['smarter','faster','more responsive','more knowledgable']
    let current_text = animated_text[animated_num]
    return current_text
  }

  setText(current_text){
    AppStore.data.current_text = current_text
    AppStore.emitChange()
  }

  addText(animated_num){
    let animated_text = this.getText(animated_num)
    let num = 0
    let partial_text
    let adding_text = setInterval(() => {
      partial_text = animated_text.slice(0, num)
      this.setText(partial_text)
      console.log(partial_text)
      if(partial_text == animated_text){
          clearInterval(adding_text)
          setTimeout(() => {
            this.startBlinking()
          },1000)
          setTimeout(() => {
            let next_text = this.getText(animated_num+1)
            if(next_text){
              console.log(next_text)
              this.removeText(animated_num)
            }
          },3000)
        }
      num++
    }, 200)
  }

  removeText(animated_num){
    let animated_text = this.getText(animated_num)
    if(this.refs.animated_text){
      this.stopBlinking()
      let removing_text = setInterval(() => {
        animated_text = animated_text.slice(0, -1)
        this.setText(animated_text)
        if(!animated_text){
          clearInterval(removing_text)
          this.addText(animated_num+1)
        }
      }, 200)
    }
  }

  animateText(){
    if(this.refs.animated_text){
      let animated_text = this.refs.animated_text.innerText
      this.removeText(0)
    }
  }
  componentWillMount(){
    let current_text = this.getText(0)
    this.setText(current_text)
    this.startBlinking()
  }

  componentDidMount(){
    
    let current_text = this.getText(0)
    this.setText(current_text)
    this.startBlinking()

    // Effects
    setTimeout(() => {
      this.animateText()
    }, 3000)
  }

  render(){
    
    // Data
    const data = this.props.data
    
    console.log(data)
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
    const signin_btn_style = S('color-fff w-130 p-10 pt-7 pb-7')
    const collapse_style = { 
      ...S('mt-20'), 
      border: 'none', 
      boxShadow: 'none'
    }
    const headline_style = S('mb-35')
    const tag_style = S('font-22 mb-40')
    const form_wrap_style = {
      ...S('br-4 p-30 pb-20 maxw-650'),
      'backgroundColor': 'rgba(0, 0, 0, 0.5)'
    }
    const footer_style = {
      ...S('absolute b-0 w-100p mb-20 pt-20 color-ededed font-13  z-2'),
      borderTop: '1px solid rgba(168,168,168, 0.3)'
    }

    // Get video and text from random number
    let random_number = data.random_number
    let video_src = 'young_agent'
    let headline_text = (
      <div>
        Be a #<span ref="animated_text">{ data.current_text }</span><span className={ data.blinking_cursor ? 'blinking-cursor' : ''}>|</span>
      </div>
    )

    if(random_number){
      video_src = 'couple'
      headline_text = (
        <div>
          From Search to Close be<br/>{ data.current_text }<span className={ data.blinking_cursor ? 'blinking-cursor' : ''}>|</span> 
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
                    <a className="btn btn-default center-block sign-in__button" href="/signin" style={ signin_btn_style }>Sign in</a>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </header>
        <main className="container" style={ S('h-100p z-2 relative') }>
          <div className="landing-main text-center" style={ S('h-100p') }>
            <div className="center-block" style={ S('maxw-700 mt-50n') }>
              <h1 className="tempo headline" style={ headline_style }>
                { headline_text }
              </h1>
              <p style={ tag_style }>
                Rechat is a crossplatform service that connects you to a million goats.<br className="hidden-xs"/>
                Get on the waiting list! We will notifiy you when we launch.
              </p>
              <div className="form-wrap center-block" style={ form_wrap_style }>
                <form onSubmit={ this.showThankYou } action="" method="post" name="mc-embedded-subscribe-form" target="_blank">
                  <Col className="form-input--email" sm={8} style={ S('pl-0') }>
                    <Input style={ S('w-100p') } bsSize="large" type="email" name="EMAIL" placeholder="Email Address"/>
                    <div style={ S('l-5000n absolute') } aria-hidden="true">
                      <input type="text" name="b_15433aab34aefd5450c23fd94_c08ce5e2f0" tabIndex="-1" value="" />
                    </div>
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
        <footer className="footer" style={ footer_style }>
          <div className="container">
            <Col className="footer-text footer-text--left" sm={6}>
              Made with <img src="/images/landing/heart.png" /> by Rechat | <a href="/">Contact Us</a>
            </Col>
            <Col className="footer-text footer-text--right" sm={6}>
              Rechat Inc. &copy; 2015. All Rights Reserved. <a href="/terms/mls">MLS Terms</a>
            </Col>
          </div>
        </footer>
      </div>

    )
  }
}