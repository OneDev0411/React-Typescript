import React from 'react'
import cn from 'classnames'

import UserAvatar from 'components/UserAvatar'

const KEYS = {
  8: 'BACKSPACE',
  13: 'ENTER',
  16: 'SHIFT',
  17: 'CTRL',
  27: 'ESC',
  32: 'SPACE',
  37: 'LEFT',
  38: 'UP',
  39: 'RIGHT',
  40: 'DOWN',
  46: 'DELETE'
}
export default class Mentions extends React.Component {
  constructor(props) {
    super(props)

    this.input = null

    this.state = {
      showSuggestions: false,
      suggestions: [],
      query: '',
      selectedIndex: 0
    }
  }

  async componentDidMount() {
    const Rx = await import('rxjs/Rx' /* webpackChunkName: "rx" */)
    const { Observable } = Rx
    const { handler } = this.props

    // get input element
    this.input = document.getElementById(handler)

    if (!this.input) {
      return false
    }

    this.inputHandler = Observable.fromEvent(this.input, 'keyup').subscribe(e =>
      this.onKeyUp(e)
    )

    this.cursorHandler = Observable.fromEvent(
      this.input,
      'keydown'
    ).subscribe(e => this.onKeyDown(e))

    this.blurHandler = Observable.fromEvent(this.input, 'blur').subscribe(e =>
      this.clearSuggestions()
    )

    this.suggestionsHandler = Observable.fromEvent(
      window,
      'keyup'
    ).subscribe(e => this.handleSuggestionsKeyEvents(e))
  }

  componentWillUnmount() {
    this.inputHandler.unsubscribe()
    this.cursorHandler.unsubscribe()
    this.blurHandler.unsubscribe()
    this.suggestionsHandler.unsubscribe()
  }

  /**
   * handle keyDown event for compose input
   */
  onKeyDown(e) {
    const { showSuggestions } = this.state
    const code = e.keyCode

    // don't change cursor while displaying suggestions list
    if (showSuggestions && (KEYS[code] === 'UP' || KEYS[code] === 'DOWN')) {
      return e.preventDefault()
    }
  }

  /**
   * handle keyUp event for compose input
   */
  onKeyUp(e) {
    const { input } = this
    const { trigger } = this.props
    const { showSuggestions } = this.state

    let isWordCharacter = true

    if (e.key) {
      isWordCharacter = e.key.length === 1
    } else {
      isWordCharacter = !KEYS[e.keyCode]
    }

    const isBackspaceOrDelete =
      KEYS[e.keyCode] === 'BACKSPACE' || KEYS[e.keyCode] === 'DELETE'

    // prevent parsing non characters and backspace
    if (!isWordCharacter && !isBackspaceOrDelete) {
      return e.preventDefault()
    }

    if (
      input.value === '' ||
      !input.value.includes(trigger) ||
      (showSuggestions === true && KEYS[e.keyCode] === 'SPACE')
    ) {
      return this.clearSuggestions()
    }

    // get query string
    const criteria = this.getQuery()

    if (criteria) {
      this.executeQuery(criteria)
    } else {
      this.clearSuggestions()
    }
  }

  /**
   * handle arrow keys for suggestions list
   */
  handleSuggestionsKeyEvents(e) {
    const { showSuggestions, suggestions, selectedIndex } = this.state
    const code = e.keyCode

    if (!showSuggestions || suggestions.length === 0) {
      return false
    }

    if (KEYS[code] === 'ESC') {
      return this.clearSuggestions()
    }

    if (KEYS[code] === 'ENTER') {
      e.preventDefault()

      return this.selectMention(suggestions[selectedIndex])
    }

    let delta = 0

    if (KEYS[code] === 'DOWN') {
      delta = 1
    } else if (KEYS[code] === 'UP') {
      delta = -1
    }

    if (delta === 0) {
      return false
    }

    let index = selectedIndex + delta

    if (index < 0) {
      index = suggestions.length - 1
    }

    if (index >= suggestions.length) {
      index = 0
    }

    this.setState({ selectedIndex: index })
  }

  /**
   * get current cursor position
   */
  getCursorPosition() {
    const { input } = this

    return input.selectionStart
  }

  /**
   * set cursor position to new index
   */
  setCursorPosition(index) {
    const { input } = this

    input.setSelectionRange(index, index)
  }

  /**
   * find trigger character index based on current cursor position
   */
  findTriggerIndex() {
    const { input } = this
    const { trigger } = this.props
    const cursorPosition = this.getCursorPosition()

    let i

    for (i = cursorPosition - 1; i >= 0; i--) {
      const char = input.value.charAt(i)
      const previousChar = input.value.charAt(i - 1).trim()

      if (char === trigger && previousChar === '') {
        break
      }

      if (char.trim() === '') {
        return null
      }
    }

    if (i === -1) {
      return null
    }

    return i
  }

  /**
   * find query string based on current cursor position
   */
  getQuery() {
    const cursorPosition = this.getCursorPosition()
    const index = this.findTriggerIndex()

    if (index === null) {
      return null
    }

    return this.input.value.substring(index, cursorPosition)
  }

  /**
   * execute a query and find results based on search criteria
   */
  executeQuery(criteria) {
    const { source } = this.props
    const text = criteria.substr(1)
    let result = source

    if (text.length > 0) {
      result = source.filter(user =>
        user.username.toLowerCase().includes(text.toLowerCase())
      )
    }

    this.setState({
      query: criteria,
      suggestions: result
    })

    if (result.length > 0) {
      this.showSuggestions()
    } else {
      this.clearSuggestions()
    }
  }

  /**
   * replace mention with query
   */
  replaceMentionWithQuery(text) {
    const { input } = this
    const index = this.findTriggerIndex()

    input.value = `${input.value.substr(0, index) + text} ${input.value.substr(
      index + text.length
    )}`

    // change cursor position
    this.setCursorPosition(index + text.length + 1)
  }

  /**
   * select/enter a mention in suggestions list
   */
  selectMention(user) {
    const { input } = this
    const { trigger } = this.props

    const username = `${trigger}${user.username}`

    this.replaceMentionWithQuery(username)

    // hide suggestions
    this.clearSuggestions()

    // set focus on input
    input.focus()
  }

  /**
   * hide suggestions list
   */
  clearSuggestions() {
    this.setState({
      showSuggestions: false,
      selectedIndex: 0
    })

    // free-up input
    this.input.setAttribute('locked', false)
  }

  /**
   * show suggestions list
   */
  showSuggestions() {
    this.setState({
      showSuggestions: true
    })

    // lock input
    this.input.setAttribute('locked', true)
  }

  render() {
    const { position } = this.props
    const { suggestions, showSuggestions, selectedIndex, query } = this.state

    if (!showSuggestions || suggestions.length === 0) {
      return false
    }

    return (
      <div
        className="suggestions"
        ref={ref => (this.suggestions = ref)}
        style={{
          bottom: `${position}px`
        }}
      >
        <div className="heading">Users matching {query}</div>
        <div className="items">
          {suggestions.map((user, index) => (
            <div
              key={`SUGGESTION_${user.id}`}
              className={cn('item', { selected: index === selectedIndex })}
              onClick={() => this.selectMention(user)}
            >
              <UserAvatar
                style={{ float: 'left', marginRight: '5px' }}
                size={24}
                name={user.name}
                image={user.avatar}
                color="#000000"
                showStateIndicator={false}
              />
              <b>{user.username}</b> &nbsp;
              {user.name !== user.username && (
                <span className="name">{user.name}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }
}
