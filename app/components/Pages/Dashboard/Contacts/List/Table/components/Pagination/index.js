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
    const { page, onPageChange, totalCount, pageSize } = this.props

    return {
      text: 'Next',
      disabled: Math.round(totalCount / pageSize) === page + 1,
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
    let buttons = [this.getPreviousButton(), this.getNextButton()]
    const pages = Math.round(this.props.totalCount / this.props.pageSize)

    // if (totalCount > 5 * pageSize) {
    // buttons.push(this.getPreviousButton())
    // buttons.push(this.getNextButton())
    // } else {
    //   for (let i = 0; i < Math.ceil(totalCount / pageSize); i++) {
    //     buttons.push(this.getNumberButton(i))
    //   }
    // }

    return (
      <div style={{ textAlign: 'center', marginTop: '1em' }}>
        {/* <span style={{ marginRight: '1em' }}>
          <b>{`${page * pageSize + 1}-${
            (page + 1) * pageSize > totalCount
              ? totalCount
              : (page + 1) * pageSize
          }`}</b>
          <span> of </span>
          <b>{`${totalCount}`}</b>
        </span> */}
        {pages > 1 && (
          <span style={{ marginRight: '1em' }}>
            <span>
              page <b>{`${this.props.page + 1}`}</b> of
            </span>
            <b>{`  ${pages}`}</b>
          </span>
        )}
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
