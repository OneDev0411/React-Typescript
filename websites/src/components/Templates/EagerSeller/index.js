import React, { Component } from 'react'
import S from 'shorti'
import { Button, Col } from 'react-bootstrap'
import default_agent_image from './images/agent.png'
import default_media from './images/media.png'
import EditBar from '../../Partials/EditBar/'
import './eager-seller.scss'

class EagerSeller extends Component {
  constructor() {
    super()
    this.state = {
      data: {
        step: 1,
        outline_color: '1561bd'
      },
      template_width: window.innerWidth - 400
    }
    window.onresize = () => {
      this.resizeWidth()
    }
  }
  resizeWidth() {
    this.setState({ ...this.state, template_width: window.innerWidth - 400 })
  }
  goToStep(step) {
    this.setState({
      ...this.state,
      data: {
        ...this.state.data,
        step
      }
    })
  }
  render() {
    const data = this.state.data
    return (
      <div style={ S('absolute w-100p h-100p color-263445') }>
        <div className="main-template" style={ S(`w-${this.state.template_width} absolute l-0`) }>
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
              <div style={ S(`bg-url(${default_agent_image}) bg-cover bg-center h-700 mb-40${data.step === 1 ? ` border-1-solid-${data.outline_color}` : ''}`) }></div>
            </section>
            <section>
              <div className="text-center">
                <div style={ S(`mb-20${data.step === 2 ? ` border-1-dotted-${data.outline_color}` : ''}`) }>
                  <div style={ S(`font-40 text-center`) }>
                    Nora Hortan
                  </div>
                  <div style={ S('font-16') }>
                    Tagline
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
                    Climb Top Producer 2006-2015
                  </div>
                  <div>
                    Top 1% of San Francisco Real Estate Agents
                  </div>
                  <div>
                    Luxury Urban Living (Condos and Lofts)
                  </div>
                  <div>
                    SOMA/South Beach Resident
                  </div>
                  <div>
                    Fluent in French
                  </div>
                </div>
              </Col>
              <Col style={ S('pr-0') } xs={ 6 }>
                <img style={ S(`${data.step === 5 ? `border-1-dotted-${data.outline_color}` : ''} w-100p`) } src={ default_media }/>
              </Col>
              <div className="clearfix"></div>
            </section>
            <section style={ S('mb-20') }>
              <Col xs={ 6 }>
                <div style={ S(`${data.step === 6 ? `border-1-dotted-${data.outline_color}` : ''}`) }>
                  “An unconditional friend who loves kickboxing and is always ready for an adventure.”
                </div>
              </Col>
              <Col style={ S('pr-0') } xs={ 6 }>
                <div>ABOUT NORA</div>
                <div style={ S(`${data.step === 7 ? `border-1-dotted-${data.outline_color}` : ''}`) }>
                  In every profession, a group of leaders emerge that set the standards for the rest. As a former elementary school teacher, Tiffany continually raised the bar and set new standards in the teaching profession. It is with that same commitment to excellence that Tiffany has made a profound presence in the real estate community by showcasing her passion for real estate and loyalty to her clients and commitment to their real estate goals. She prides herself on open, honest and consistent communication with clients paired with the best customer relations in the industry. Her love for developing and strengthening relationships with others and impeccable follow through has continually maintained her phenomenal reputation with both clients and colleagues. Real estate relationships built on trust and the highest level of confidentiality are especially important to her.
                </div>
              </Col>
              <div className="clearfix"></div>
            </section>
          </main>
        </div>
        <EditBar
          data={ data }
          goToStep={ this.goToStep.bind(this) }
        />
      </div>
    )
  }
}

export default EagerSeller
