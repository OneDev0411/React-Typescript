import React from 'react'

import { Button } from './styled'

class Pagination extends React.Component {
  getPreviousButton = () => {
    const { page, onPageChange, canPrevious } = this.props

    return {
      text: 'Prev',
      disabled: !canPrevious,
      onClick: () => onPageChange(page - 1)
    }
  }

  getNextButton = () => {
    const { page, onPageChange, canNext } = this.props

    return {
      text: 'Next',
      disabled: !canNext,
      onClick: () => onPageChange(page + 1)
    }
  }

  getNumberButton = pageNumber => {
    const { page, onPageChange } = this.props

    return {
      text: pageNumber + 1,
      selected: page === pageNumber,
      onClick: () => onPageChange(pageNumber)
    }
  }

  render() {
    let buttons = []
    const { page, pageSize, totalCount } = this.props

    if (totalCount > 5 * pageSize) {
      buttons.push(this.getPreviousButton())
      buttons.push(this.getNextButton())
    } else {
      for (let i = 0; i < Math.ceil(totalCount / pageSize); i++) {
        buttons.push(this.getNumberButton(i))
      }
    }

    return (
      <div
        style={{
          textAlign: 'center',
          marginBottom: '2em'
        }}
      >
        <span style={{ marginRight: '1em' }}>
          <b>{`${page * pageSize + 1}-${
            (page + 1) * pageSize > totalCount
              ? totalCount
              : (page + 1) * pageSize
          }`}</b>
          <span> of </span>
          <b>{`${totalCount}`}</b>
        </span>
        {buttons.map((props, index) => (
          <Button {...props} key={index}>
            {props.text}
          </Button>
        ))}
      </div>
    )
  }
}

export default Pagination
