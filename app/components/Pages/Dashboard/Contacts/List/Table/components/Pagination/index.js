import React from 'react'

import { Button } from './styled'

export class Pagination extends React.Component {
  getPreviousButton = () => ({
    text: 'Prev',
    disabled: this.props.currentPage === 1,
    onClick: () => this.props.onPageChange(this.props.currentPage - 1)
  })

  getNextButton = () => ({
    text: 'Next',
    disabled:
      Math.ceil(this.props.totalCount / this.props.pageSize) ===
      this.props.currentPage,
    onClick: () => this.props.onPageChange(this.props.currentPage + 1)
  })

  getNumberButton = page => ({
    text: page,
    selected: this.props.currentPage === page,
    onClick: () => this.props.onPageChange(page)
  })

  getButtons(current, last) {
    const delta = 2
    const left = current - delta
    const right = current + delta + 1
    let range = []
    let buttons = []
    let l

    for (let i = 1; i <= last; i++) {
      if (i === 1 || i === last || (i >= left && i < right)) {
        range.push(i)
      }
    }

    buttons.push(this.getPreviousButton())
    range.forEach(i => {
      if (l) {
        if (i - l === 2) {
          buttons.push(this.getNumberButton(l + 1))
        } else if (i - l !== 1) {
          buttons.push({ text: '...', disabled: true })
        }
      }

      buttons.push(this.getNumberButton(i))

      l = i
    })
    buttons.push(this.getNextButton())

    return buttons
  }

  render() {
    let buttons = []

    if (this.props.totalCount > 5 * this.props.pageSize) {
      buttons = this.getButtons(this.props.currentPage, this.props.pages)
    } else {
      for (let i = 1; i <= this.props.pages; i++) {
        buttons.push(this.getNumberButton(i))
      }
    }

    return (
      <div style={{ textAlign: 'center', marginTop: '1em' }}>
        {buttons.map((props, index) => (
          <Button {...props} key={index}>
            {props.text}
          </Button>
        ))}
      </div>
    )
  }
}
