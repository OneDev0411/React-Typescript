import React, { Component } from 'react'
import S from 'shorti'
import { Button, Col } from 'react-bootstrap'
import { Link } from 'react-router'

class App extends Component {
  render() {
    const bg_gradient = 'linear-gradient(to bottom, rgba(38, 51, 69, 0.9), #18222e)'
    return (
      <div style={ S('absolute w-100p h-100p') }>
        <Col sm={ 6 } className="hidden-xs hidden-sm" style={ { ...S('h-100p'), backgroundImage: bg_gradient } }>
          <div style={ S('w-100p text-center') }>
            <img role="presentation" src="/images/get-started/mac-book@3x.png" style={ S('w-428 center-block') }/>
          </div>
          <div>
            <img role="presentation" src="/images/get-started/book@3x.png" style={ S('w-141 absolute l-0 t-50p') }/>
            <img role="presentation" src="/images/get-started/glasses@3x.png" style={ S('w-117 absolute l-70 t-50p') }/>
            <img role="presentation" src="/images/get-started/iphone@3x.png" style={ S('w-82 absolute l-150 t-70p') }/>
            <img role="presentation" src="/images/get-started/headphones@3x.png" style={ S('w-279 absolute b-0') }/>
            <Link to="https://rechat.com" style={ S('w-279 absolute b-21 l-274') }>
              <Button style={ S('color-666 font-12 border-none h-36 w-140') }>Powered by <span style={ S('color-2196f3') }>Rechat</span></Button>
            </Link>
          </div>
        </Col>
        <Col sm={ 6 } style={ S('h-100p bg-fff p-15') }>
          <div style={ S('w-340 ml-80 color-263445') }>
            <div style={ S('font-45 mb-55') }>
              Your personality,
              your brand.
            </div>
            <div style={ S('font-14 mb-67') }>
              Rechat’s Dynamic Web Templates are built beautifully to 
              adapt to your personality and to your brand.
            </div>
            <Link to="/templates">
              <Button style={ S('bg-f67608 color-fff border-none h-40 w-340') }>Get Started</Button>
            </Link>
          </div>
        </Col>
      </div>
    )
  }
}

export default App
