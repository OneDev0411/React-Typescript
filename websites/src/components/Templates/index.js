import React, { Component } from 'react'
import S from 'shorti'
import { Link } from 'react-router'
import { Button } from 'react-bootstrap'
import './templates.scss'
import thumb_1 from './EagerSeller/assets/images/thumb.png'

class Templates extends Component {
  render() {
    const bg_gradient = 'linear-gradient(to bottom, rgba(38, 51, 69, 0.9), #18222e)'
    return (
      <div style={ { ...S('absolute w-100p h-100p'), backgroundImage: bg_gradient } }>
        <div style={ S('font-36 color-fff text-center mt-60') }>Choose a website layout</div>
        <div className="container" style={ S('mt-60') }>
          <div className="template-thumb" style={ S('w-440 h-284 relative') }>
            <img role="presentation" className="template-thumb__image" style={ S('w-100p absolute') } src={ thumb_1 } />
            <div className="template-thumb__buttons" style={ S('absolute text-center w-100p h-100p pt-100') }>
              <Link to="/templates/eager-seller">
                <Button style={ S('bg-f67608 color-fff border-none w-120 h-40 mr-5') }>Select</Button>
              </Link>
              <Link to="/templates/eager-seller?preview=true">
                <Button className="preview" style={ S('color-fff border-none w-120 h-40 border-1-solid-fff') }>Preview</Button>
              </Link>
            </div>
            <div className="template-thumb__overlay"></div>
          </div>
        </div>
      </div>
    )
  }
}

export default Templates
