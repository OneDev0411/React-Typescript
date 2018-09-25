import React from 'react'

export default class AutoSizeInput extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.calculateWidth()
  }

  inputRef(el) {
    this.input = el
  }

  getInput() {
    return this.input
  }

  calculateWidth() {
    const { placeholder } = this.props
    const input = this.getInput()
    const value = input.value

    // get input string. if value is blank use placeholder instead
    const width =
      value.length === 0 && placeholder
        ? placeholder.length * 10
        : input.scrollWidth + 2

    input.style.width = `${width}px`
  }

  render() {
    return (
      <input
        {...this.props}
        type="text"
        ref={el => this.inputRef(el)}
        onChange={() => this.calculateWidth()}
      />
    )
  }
}
