import React from 'react'
import actions from '../../../../../../../../../store_actions/listings/alerts'

// https://github.com/DieterHolvoet/event-propagation-path
Event.prototype.propagationPath = function propagationPath() {
  const polyfill = () => {
    let element = this.target
    let pathArr = [element]

    if (element === null || element.parentElement === null) {
      return []
    }

    while (element.parentElement !== null) {
      element = element.parentElement
      pathArr.unshift(element)
    }

    return pathArr
  }

  return this.path || (this.composedPath && this.composedPath()) || polyfill()
}

class AlertListItemMenu extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isOpen: false
    }

    this._setIsOpen = this._setIsOpen.bind(this)
    this._onCLickDocumentHandler = this._onCLickDocumentHandler.bind(this)
  }

  componentWillUnmount() {
    document.removeEventListener('click', this._onCLickDocumentHandler, false)
  }

  _setIsOpen(isOpen) {
    this.setState({
      isOpen
    })
  }

  _onCLickDocumentHandler(event) {
    const triggeredNodeIsEqualWithComponentNode = event
      .propagationPath()
      .includes(this.componentNode)

    if (!triggeredNodeIsEqualWithComponentNode) {
      this._setIsOpen(false)
      document.removeEventListener('click', this._onCLickDocumentHandler, false)
    }
  }

  render() {
    const { isOpen } = this.state
    const { alertId, onClickEdit, onClickDelete } = this.props
    return (
      <div
        id={alertId}
        className={`${isOpen ? 'is-open' : ''}`}
        ref={node => {
          this.componentNode = node
        }}
      >
        <button
          onClick={() => {
            if (!isOpen) {
              document.addEventListener(
                'click',
                this._onCLickDocumentHandler,
                false
              )
            } else {
              document.removeEventListener(
                'click',
                this._onCLickDocumentHandler,
                false
              )
            }
            this._setIsOpen(!isOpen)
          }}
          className="c-alertList__item__menu-trigger-btn"
        >
          <svg
            fill="#78909c"
            height="24"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
          </svg>
        </button>
        <ul className="c-alertList__item__menu">
          {/* <li>
            <button
              disabled
              onClick={onClickEdit}
              className="c-alertList__item__menu__item-btn"
            >
              <svg
                fill="#78909c"
                height="24"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                <path d="M0 0h24v24H0z" fill="none" />
              </svg>
              <span>Edit</span>
            </button>
          </li>
          <li className="c-alertList__item__menu__divider" /> */}
          <li>
            <button
              onClick={onClickDelete}
              className="c-alertList__item__menu__item-btn"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="19"
                viewBox="0 0 18 19"
                fill="#78909c"
              >
                <path d="M4 7h10l.001 10H4V7zM2 17c0 1.103.897 2 2 2h10c1.103 0 2-.897 2-2V5H2v12zM12 2V0H6v2H0v2h18V2z" />
                <path d="M6 15h2V9H6zM10 15h2V9h-2z" />
              </svg>
              <span>Delete</span>
            </button>
          </li>
        </ul>
      </div>
    )
  }
}

export default AlertListItemMenu
