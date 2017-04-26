import React from 'react'
import Avatar from 'react-avatar'

const DocumentLink = ({
  src,
  name,
  type,
  onClickPreviewHandler
}) => (
  <a
    href={src}
    target="_blank"
    className="c-request-review__item__link"
    onClick={(e) => {
      if (type === 'pdf') return
      e.preventDefault()
      onClickPreviewHandler({
        src,
        name
      })
    }}
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="10" viewBox="0 0 18 10"><g fill="none" fillRule="evenodd"><g stroke="#9B9B9B"><path d="M16.92 5s-3.564 4.5-7.962 4.5C4.562 9.5.998 5 .998 5S4.56.5 8.958.5 16.92 5 16.92 5z" /><circle cx="8.958" cy="5" r="2.5" /></g><path d="M-3-7h24v24H-3z" /></g></svg>
  </a>
)

const DocumentDetail = ({
  url,
  title,
  state,
  avatar,
  previewModalShowHandler
}) => {
  const fileType = avatar.type ? 'img' : 'pdf'
  return (
    <div>
      {
        avatar.type
        ? <Avatar
          src={avatar.src}
          size={24}
          style={{ marginRight: '10px', verticalAlign: 'middle' }}
        />
        : <svg
          viewBox="0 0 20 24"
          width="24" height="24"
          xmlns="http://www.w3.org/2000/svg"
          className="c-request-review__item__icon"
        >
          <g fill="none" fillRule="evenodd"><g stroke="#000"><path d="M13.5.5v6h6" /><path d="M19.5 23.5H.5V.5h13l6 6z" /><path d="M9.5 18.5v-5h1c1.152 0 2 1.068 2 2.5s-.848 2.5-2 2.5h-1zM14.5 18.5v-5H17M14.5 15.5H16M4.5 18.499V13.5h1.25a1.25 1.25 0 1 1 0 2.5H4.5" /></g><path d="M-2 0h24v24H-2z" /></g>
        </svg>
      }
      <span className="c-request-review__item__title">{title}</span>
      {
        state !== 'unclear' && <p className={`review-state--submit-request review-state--${state.toLowerCase()}`}>{state.toUpperCase()}</p>
      }
      <DocumentLink
        src={url}
        name={title}
        type={fileType}
        onClickPreviewHandler={previewModalShowHandler}
      />
    </div>
  )
}

export default class Document extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isSelected: false,
      isReviewed: props.state !== 'unclear'
    }

    this.onClickHandler = this.onClickHandler.bind(this)
  }

  onClickHandler() {
    const isSelected = !this.state.isSelected
    this.setState({
      isSelected
    })
    this.props.onSelectedHandler(isSelected)
  }

  render() {
    const {
      id,
      type,
      state,
      title,
      avatar,
      fileUrl,
      onFilePreviewModalShowHandler
    } = this.props
    const { isReviewed } = this.state
    const selectedClassName = this.state.isSelected ? 'is-selected' : ''
    return (
      <div
        className="c-request-review__item"
      >
        {
          !isReviewed && <input
            type="checkbox" id={id}
            name={type === 'file' ? 'file' : 'envelope_document'}
            className="c-request-review__item__checkbox"
          />
        }
        {
          !isReviewed
          ? <label
            htmlFor={id}
            className={
              `c-request-review__item__label
              ${selectedClassName}`
            }
            onClick={this.onClickHandler}
          >
            <DocumentDetail
              title={title}
              state={state}
              avatar={avatar}
              url={fileUrl}
              previewModalShowHandler={onFilePreviewModalShowHandler}
            />
          </label>
          : <div className="c-request-review__item__detail">
            <DocumentDetail
              title={title}
              state={state}
              avatar={avatar}
              url={fileUrl}
              previewModalShowHandler={onFilePreviewModalShowHandler}
            />
          </div>
        }
      </div>
    )
  }
}
