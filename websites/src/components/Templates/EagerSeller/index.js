import React, { Component } from 'react'
import S from 'shorti'
import { Button, Col } from 'react-bootstrap'
import default_agent_image from './images/agent.png'
import EditBar from '../../Partials/EditBar/'
import './eager-seller.scss'
import template from './template.json'
import _ from 'lodash'
import Website from '../../../models/Website'

class EagerSeller extends Component {
  constructor() {
    super()
    this.state = {
      data: {
        step: 1,
        outline_color: '1561bd',
        ...template,
        template_width: window.innerWidth - 400
      }
    }
    this.getWebsite()
    window.onresize = () => {
      this.resizeWidth()
    }
  }
  getWebsite() {
    const params = {
      access_token: 'YWQ0Zjk1YzAtYWE5Mi0xMWU2LWE5NDQtYTVmYzQ5ZDc2Yjk5'
    }
    Website.get(params, (err, res) => {
      if (err) {
        this.setState({
          data: {
            ...this.state.data,
            error: true
          }
        })
        return
      }
      // Reset input values in steps
      const steps = this.state.data.steps
      const saved_attributes = res.data[res.data.length - 1].attributes
      steps.forEach(step => {
        const attributes = step.attributes
        attributes.forEach(attribute => {
          attribute.value = saved_attributes[attribute.key]
        })
      })
      this.setState({
        data: {
          ...this.state.data,
          attributes: saved_attributes,
          steps: [
            ...steps
          ]
        }
      })
    })
  }
  resizeWidth() {
    this.setState({
      data: {
        ...this.state.data,
        template_width: window.innerWidth - 400
      }
    })
  }
  goToStep(step) {
    this.setState({
      data: {
        ...this.state.data,
        step
      }
    })
  }
  editText(key, value) {
    const data = this.state.data
    const steps = data.steps
    const step = steps[data.step - 1]
    const attribute = _.find(step.attributes, { key })
    attribute.value = value
    data.attributes[key] = value
    this.setState({
      data: {
        ...this.state.data
      }
    })
  }
  uploadMedia(key, accepted_files) {
    const data = this.state.data
    const steps = data.steps
    const step = steps[data.step - 1]
    const attribute = _.find(step.attributes, { key })
    attribute.value = accepted_files[0].preview
    data.attributes[key] = accepted_files[0].preview
    this.setState({
      data: {
        ...this.state.data
      }
    })
  }
  saveWebsite() {
    const params = {
      website: {
        template: 'light',
        brand: '0e4487b2-5360-11e6-a9f9-0242ac11000b',
        attributes: this.state.data.attributes
      },
      access_token: 'YWQ0Zjk1YzAtYWE5Mi0xMWU2LWE5NDQtYTVmYzQ5ZDc2Yjk5'
    }
    Website.save(params, (err, res) => {
      console.log(res)
    })
  }
  render() {
    const data = this.state.data
    const attributes = data.attributes
    return (
      <div style={ S('absolute w-100p h-100p color-263445') }>
        <div className="main-template" style={ S(`w-${data.template_width} absolute l-0`) }>
          <nav style={ S('h-100') }>
            <div style={ S('pull-left pt-20') }>
              <a href="#">ClayStapp</a>
            </div>
            <div style={ S('pull-right pt-20') }>
              <ul className="nav-links">
                <li>HIGHLIGHTS</li>
                <li>ABOUT ME</li>
                <li>MY LISTINGS</li>
                <li><Button>Search With Me</Button></li>
              </ul>
            </div>
          </nav>
          <main>
            <section>
              <div style={ S(`bg-url(${attributes.cover_image ? attributes.cover_image : default_agent_image }) bg-cover bg-center h-700 mb-40${data.step === 1 ? ` border-1-solid-${data.outline_color}` : ''}`) }></div>
            </section>
            <section>
              <div className="text-center">
                <div style={ S(`mb-20${data.step === 2 ? ` border-1-dotted-${data.outline_color}` : ''}`) }>
                  <div style={ S(`font-40 text-center`) }>
                    { attributes.title }
                  </div>
                  <div style={ S('font-16') }>
                    { attributes.tagline }
                  </div>
                </div>
                <div style={ S('font-14 mb-20') }>
                  MLS#: 0142356&nbsp;&nbsp;|&nbsp;&nbsp;
                  linne@claystapp.com&nbsp;&nbsp;|&nbsp;&nbsp;
                  805.698.6694
                </div>
              </div>
            </section>
            <section style={ S('mb-20') }>
              <div style={ S(`text-center w-200 center-block${data.step === 3 ? ` border-1-dotted-${data.outline_color}` : ''}`) }>
                <i style={ S('font-20') } className="fa fa-facebook"></i>&nbsp;&nbsp;&nbsp;
                <i style={ S('font-20') } className="fa fa-instagram"></i>&nbsp;&nbsp;&nbsp;
                <i style={ S('font-20') } className="fa fa-twitter"></i>
              </div>
            </section>
            <section style={ S('mb-20') }>
              <Col xs={ 6 }>
                <div>Quick Highlights</div>
                <div style={ S(`${data.step === 4 ? `border-1-dotted-${data.outline_color}` : ''}`) }>
                  <div>
                    { attributes.highlight_1 }
                  </div>
                  <div>
                    { attributes.highlight_2 }
                  </div>
                  <div>
                    { attributes.highlight_3 }
                  </div>
                  <div>
                    { attributes.highlight_4 }
                  </div>
                  <div>
                    { attributes.highlight_5 }
                  </div>
                </div>
              </Col>
              <Col style={ S('pr-0') } xs={ 6 }>
                <iframe frameBorder="0" src={ attributes.video_url } width="100%" height="360" allowFullScreen></iframe>
              </Col>
              <div className="clearfix"></div>
            </section>
            <section style={ S('mb-20') }>
              <Col xs={ 6 }>
                <div style={ S(`${data.step === 6 ? `border-1-dotted-${data.outline_color}` : ''}`) }>
                  { attributes.quote }
                </div>
              </Col>
              <Col style={ S('pr-0') } xs={ 6 }>
                <div>ABOUT NORA</div>
                <div style={ S(`${data.step === 7 ? `border-1-dotted-${data.outline_color}` : ''}`) }>
                  { attributes.bio }
                </div>
              </Col>
              <div className="clearfix"></div>
            </section>
          </main>
        </div>
        <EditBar
          data={ data }
          goToStep={ this.goToStep.bind(this) }
          uploadMedia={ this.uploadMedia.bind(this) }
          editText={ this.editText.bind(this) }
          saveWebsite={ this.saveWebsite.bind(this) }
        />
      </div>
    )
  }
}

export default EagerSeller