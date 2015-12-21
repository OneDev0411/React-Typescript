// Dashboard/Transactions/New/index.js
import React, { Component } from 'react'
import { Link } from 'react-router'
import { Button, Input, Col } from 'react-bootstrap'
import S from 'shorti'
import config from '../../../../../../config/public'

// AppDispatcher
import AppDispatcher from '../../../../../dispatcher/AppDispatcher'

// AppStore
import AppStore from '../../../../../stores/AppStore'

// Partials
import MainNav from '../../Partials/MainNav'
import SideBar from '../../Partials/SideBar'

export default class NewTransaction extends Component {

  componentDidMount(){
    AppStore.data.new_transaction = {
      step: 0
    }
    AppStore.emitChange()
  }

  handleSteps(direction,type){
    
    // Data
    const data = this.props.data

    if(direction === 'forward'){
      const step = data.new_transaction.step + 1
      AppStore.data.new_transaction = {
        step: step
      }
      AppStore.emitChange()
    }

    if(direction === 'back'){
      const step = data.new_transaction.step - 1
      AppStore.data.new_transaction = {
        step: step
      }
      AppStore.emitChange()
    }

  }

  render(){

    // Data
    const data = this.props.data
    const main_style = S('absolute l-222 r-0 ml-20 w-960 h-300')
    const path = data.path

    let main_content = (
      <div>
        <h1>Keep'em comin!  So are we...</h1>
        <div>
          <Button onClick={ this.handleSteps.bind(this,'forward','buying') } className="btn btn-primary">Buying</Button>
          <Button onClick={ this.handleSteps.bind(this,'forward','selling') } style={ S('ml-40') } className="btn btn-primary">Selling</Button>
          <Button onClick={ this.handleSteps.bind(this,'forward','buying-selling') } style={ S('ml-40') } className="btn btn-primary">Buying & Selling</Button>
          <Button onClick={ this.handleSteps.bind(this,'forward','lease') } style={ S('ml-40') } className="btn btn-primary">Lease</Button>
        </div>
      </div>
    )

    if(data.new_transaction && data.new_transaction.step === 1)
      main_content = (
        <div>
          <h1>Very nice. Who are we creating this <br/>transaction for?</h1>
          <div>
            <form style={ S('maxw-820') }>
              <Input className="pull-left" style={ S('w-640') } type="text" placeholder="Enter any name, email or phone number"/>
              <Button className="pull-left" style={ S('w-160 ml-10') } bsStyle="primary" type="button">Add New Contact</Button>
            </form>
            <div className="clearfix"></div>
          </div>
          <div style={ S('absolute r-0 b-0') }>
            <Button bsStyle="link" style={ S('mr-20') } onClick={ this.handleSteps.bind(this,'back','') }>Back</Button>
            <Button onClick={ this.handleSteps.bind(this,'forward','') }>Next</Button>
          </div>
        </div>
      )

    return (
      <div style={ S('minw-1000') }>
        <header>
          <MainNav data={ data }/>
        </header>
        <main>
          <SideBar data={ data }/>
          <div style={ main_style }>
            { main_content }
          </div>
        </main>
      </div>
    )
  }
}

// PropTypes
NewTransaction.proptypes = {
  data: React.PropTypes.object.isRequired
}