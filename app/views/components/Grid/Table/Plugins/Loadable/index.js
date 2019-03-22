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
    const target = el.target.scrollingElement || el.target

    const top = target.scrollTop - target.clientTop
    const end = target.scrollHeight - target.offsetHeight

    const { onScrollBottom, onScrollTop } = this.options

    if (top >= end - accuracy) {
      this.lastScrollTop = top

      return onScrollBottom && onScrollBottom(top)
    }

    const isScrolledToTop = top <= this.lastScrollTop

    this.lastScrollTop = top

    if (isScrolledToTop && top <= accuracy) {
      return onScrollTop && onScrollTop(top)
    }
  }

  unregister = () => {
    window.removeEventListener('scroll', this.onScroll, true)
  }
}
