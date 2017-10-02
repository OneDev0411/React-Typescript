import React from 'react'
import { FormControl } from 'react-bootstrap'

export default class extends React.Component {
  constructor(props) {
    super(props)
  }

  async componentDidMount() {
    const Rx = await import('rxjs/Rx' /* webpackChunkName: "rx" */)
    const { Observable } = Rx

    this.searchHandler = Observable
      .fromEvent(this.search_input, 'keyup')
      .debounceTime(1000)
      .subscribe((e) => this.props.subscribe(e.target.value))
  }

  componentWillUnmount() {
    if (this.searchHandler) {
      this.searchHandler.unsubscribe()
    }
  }

  render() {
    return (
      <FormControl
        className="rx-input"
        value={this.props.value}
        onChange={(e) => this.props.onChange(e)}
        inputRef={ref => this.search_input = ref}
        placeholder={this.props.placeholder}
      />
    )
  }
}
