import _ from 'underscore'

export class LoadablePlugin {
  constructor({ options }) {
    this.options = options

    if (!options.container) {
      throw new Error('container field is required')
    }

    this.onScroll = _.debounce(
      this.onScroll.bind(this),
      options.debounceTime || 500
    )

    const container = document.getElementById(options.container)

    if (!container) {
      throw new Error('the container element is not exist in DOM')
    }

    container.addEventListener('scroll', this.onScroll, false)
  }

  onScroll = el => {
    const { onScrollBottom, onScrollTop } = this.options
    const accuracy = this.options.accuracy || 90
    const accuracyTop = this.options.accuracyTop || 90
    const target = el.target.scrollingElement || el.target

    const top = target.scrollTop - target.clientTop
    const end = target.scrollHeight - target.offsetHeight

    if (top >= end - accuracy) {
      this.lastScrollTop = top

      return onScrollBottom && onScrollBottom(top)
    }

    const isScrolledToTop = top <= this.lastScrollTop

    this.lastScrollTop = top

    if (isScrolledToTop && top <= accuracyTop) {
      return onScrollTop && onScrollTop(top)
    }
  }

  unregister = () => {
    window.removeEventListener('scroll', this.onScroll, true)
  }
}
