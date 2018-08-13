import _ from 'underscore'

export class LoadablePlugin {
  constructor({ options }) {
    this.options = options

    this.onScroll = _.debounce(
      this.onScroll.bind(this),
      options.debounceTime || 500
    )

    window.addEventListener('scroll', this.onScroll, true)
  }

  onScroll = el => {
    const accuracy = this.options.accuracy || 90
    const top = el.target.scrollTop - el.target.clientTop
    const end = el.target.scrollHeight - el.target.offsetHeight

    if (top >= end - accuracy) {
      this.lastScrollTop = top

      this.options.onTrigger(top)
    }
  }

  unregister = () => {
    window.removeEventListener('scroll', this.onScroll, true)
  }
}
