import React from 'react'
import _ from 'underscore'
import AutoSizeInput from '../AutoSizeInput'
import UserAvatar from '../UserAvatar'

export default class extends React.Component {
  async componentDidMount() {
    const Rx = await import('rxjs/Rx' /* webpackChunkName: "rx" */)
    const { Observable } = Rx

    this.inputHandler = Observable
      .fromEvent(this.autosize.getInput(), 'keyup')
      .map(e => e.target.value)
      .filter(text => text.length === 0 || text.length >= 3)
      .debounceTime(300)
      .subscribe(text => this.props.onSearch(text))
  }

  componentWillUnmount() {
    this.inputHandler.unsubscribe()
  }

  setInputRef(ref) {
    if (!ref || this.autosize)
      return false

    this.autosize = ref
    this.props.inputRef(ref.getInput())
  }

  render() {
    const { recipients } = this.props

    return (
      <div className="tags-container">
        <span className="to">To: </span>

        {
          _.map(recipients, recp =>
            <div
              key={`ITEM_${recp.id}`}
              className="tag"
            >
              <UserAvatar
                showStateIndicator={false}
                name={recp.display_name}
                image={recp.image}
                size={22}
              />

              <span>{ recp.display_name }</span>
              <i
                className="fa fa-times"
                onClick={() => this.props.onRemove(recp)}
              />
            </div>
          )
        }

        <AutoSizeInput
          type="text"
          ref={ref => this.setInputRef(ref)}
          placeholder={_.size(recipients) === 0 ? 'Enter name, email or phone' : ''}
          maxLength={254}
        />
      </div>
    )
  }
}
