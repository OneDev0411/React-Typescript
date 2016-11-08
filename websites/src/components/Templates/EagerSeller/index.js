import React, { Component } from 'react'
import S from 'shorti'
import { Button } from 'react-bootstrap'
import default_agent_image from './images/agent.png'
import EditBar from '../../Partials/EditBar/'
import './eager-seller.scss'

class EagerSeller extends Component {
  render() {
    const data = this.props.data
    return (
      <div style={ S('absolute w-100p h-100p color-263445') }>
        <div className="main-template" style={ S(`w-${window.innerWidth - 400} absolute l-0`) }>
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
              <div style={ S(`bg-url(${default_agent_image}) bg-cover bg-center h-700 mb-40`) }></div>
            </section>
            <section>
              <div className="text-center">
                <div style={ S('font-40 mb-20') }>Nora Hortan</div>
                <div style={ S('font-14 mb-20') }>
                  MLS#: 0142356&nbsp;&nbsp;|&nbsp;&nbsp;
                  linne@claystapp.com&nbsp;&nbsp;|&nbsp;&nbsp;
                  805.698.6694
                </div>
              </div>
            </section>
          </main>
        </div>
        <EditBar data={ data }/>
      </div>
    )
  }
}

export default EagerSeller
