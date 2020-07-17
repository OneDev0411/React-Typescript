import React from 'react'
import _ from 'underscore'
import cn from 'classnames'
import { mdiClose } from '@mdi/js'

import { muiIconSizes } from 'components/SvgIcons/icon-sizes'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import UserAvatar from 'components/UserAvatar'

import AutoSizeInput from '../AutoSizeInput'

export default class extends React.Component {
  state = { isFocused: false }

  async componentDidMount() {
    const Rx = await import('rxjs/Rx' /* webpackChunkName: "rx" */)
    const { Observable } = Rx

    const checkInputKey = e => {
      let addKey

      // new browsers
      if (e.key) {
        addKey = e.key === 'Enter' || e.key === 'Tab' || e.key === ','
        // old browsers
      } else {
        addKey = e.keyCode === 13 || e.keyCode === 9 || e.key === 188
      }

      return addKey
    }

    this.inputHandlerKeyUp = Observable.fromEvent(
      this.autosize.getInput(),
      'keyup'
    )
      .filter(e => !checkInputKey(e))
      .map(e => e.target.value)
      .filter(text => text.length === 0 || text.length >= 3)
      .debounceTime(300)
      .subscribe(text => this.props.onSearch(text))

    this.disposeInputHandlerKeyDown = Observable.fromEvent(
      this.autosize.getInput(),
      'keydown'
    )
      .filter(e => checkInputKey(e))
      .subscribe(e => this.props.addFirstSuggestion(e))
  }

  componentWillUnmount() {
    this.inputHandlerKeyUp.unsubscribe()
    this.disposeInputHandlerKeyDown.unsubscribe()
  }

  setInputRef(ref) {
    if (!ref || this.autosize) {
      return false
    }

    this.autosize = ref
    this.props.inputRef(ref.getInput())
  }

  onBlur = () => this.setState({ isFocused: false })

  onFocus = () => this.setState({ isFocused: true })

  render() {
    const { recipients } = this.props
    const { isFocused } = this.state

    return (
      <div className={cn('tags-container', { isFocused })}>
        <span className="to">To: </span>

        {_.map(recipients, recp => (
          <div key={`ITEM_${recp.id}`} className="tag">
            <UserAvatar
              showStateIndicator={false}
              name={recp.display_name}
              image={recp.image}
              size={22}
              color="#000000"
            />

            <div className="display-name">{recp.display_name}</div>
            <SvgIcon
              onClick={() => this.props.onRemove(recp)}
              path={mdiClose}
              size={muiIconSizes.small}
            />
          </div>
        ))}

        <AutoSizeInput
          onBlur={this.onBlur}
          onFocus={this.onFocus}
          type="text"
          ref={ref => this.setInputRef(ref)}
          placeholder={
            _.size(recipients) === 0 ? 'Enter name, email or phone' : ''
          }
          maxLength={254}
        />
      </div>
    )
  }
}
