// Partials/ChatModule.js
import React, { Component } from 'react'
import { Button, Input } from 'react-bootstrap'
import S from 'shorti'
import Brand from '../../../../controllers/Brand'
import controller from '../controller'
export default class ChatModule extends Component {
  render() {
    const data = this.props.data
    const agent = this.props.agent
    const chat_module = data.chat_module
    const chat_bubble_style = {
      boxShadow: '0 6px 30px 0 rgba(0, 0, 0, 0.2)',
      ...S('w-380 h-600 z-3 br-8 absolute bg-fff l-80n b-60')
    }
    let button = (
      <Button onClick={ controller.chat_module.showChatBubble } style={ S(`w-100p bg-${Brand.color('primary', 'a1bde4')} border-1-solid-${Brand.color('primary', 'a1bde4')} color-fff`) }>
        <i className="fa fa-comment-o"></i>&nbsp;&nbsp;Chat With Me
      </Button>
    )
    const header_style = {
      ...S('bg-263445 h-80 p-20'),
      borderTopLeftRadius: '8px',
      borderTopRightRadius: '8px'
    }
    let chat_bubble
    if (data.show_chat_bubble && data.brand) {
      const profile_image_area = (
        <div style={ S('br-100 w-40 h-40 bg-cover bg-center bg-url(' + agent.profile_image_url + ')') } />
      )
      const footer_style = {
        ...S('bg-fafafa h-60 w-100p absolute b-0'),
        borderBottomLeftRadius: '8px',
        borderBottomRightRadius: '8px'
      }
      let messages
      if (chat_module && chat_module.messages) {
        messages = (
          <div>Messages</div>
        )
      }
      const input_style = {
        ...S('border-none bg-fafafa h-60'),
        borderTopLeftRadius: '0',
        borderTopRightRadius: '0',
        borderBottomLeftRadius: '8px',
        borderBottomRightRadius: '8px'
      }
      chat_bubble = (
        <div style={ chat_bubble_style }>
          <div style={ header_style }>
            <div style={ S('pull-left mr-10') }>
              { profile_image_area }
            </div>
            <div style={ S('pull-left color-bfc3c7') }>
              <span style={ S('fw-400 color-fff') }>{ agent.first_name } { agent.last_name }</span>, Listing Agent
            </div>
          </div>
          { messages }
          <div style={ footer_style }>
            <Input onKeyUp={ controller.chat_module.handleKeyUp.bind(this, agent) } autoFocus style={ input_style } type="text" placeholder="Write Message" />
          </div>
        </div>
      )
      button = (
        <Button onClick={ controller.chat_module.hideChatBubble } style={ S(`font-30 p-0 br-150 w-50 h-50 pull-right bg-${Brand.color('primary', 'a1bde4')} border-1-solid-${Brand.color('primary', 'a1bde4')} color-fff`) }>
          <div style={ S('mt-3n') }>&times;</div>
        </Button>
      )
    }
    return (
      <div style={ S('h-50') }>
        { chat_bubble }
        { button }
        <div className="clearfix"></div>
      </div>
    )
  }
}
ChatModule.propTypes = {
  data: React.PropTypes.object,
  showChatBubble: React.PropTypes.func,
  agent: React.PropTypes.object
}