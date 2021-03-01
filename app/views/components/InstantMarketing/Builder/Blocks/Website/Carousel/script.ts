declare const Splide: any
declare const SimpleLightbox: any

function script({ heightRatio }) {
  const element: HTMLElement = this
  const elementId = element.id

  function initCarousel() {
    const splide = new Splide(
      element instanceof Element ? element : `#${elementId}`,
      {
        type: 'loop',
        padding: {
          left: 0,
          right: '6rem'
        },
        keyboard: 'focused',
        heightRatio,
        classes: {
          arrows: 'splide__arrows',
          arrow: 'splide__arrow',
          prev: 'splide__arrow--prev',
          next: 'splide__arrow--next'
        },
        arrowPath:
          'M 11.058594 0.253906 C 10.714844 -0.078125 10.164062 -0.0703125 9.828125 0.277344 C 9.503906 0.613281 9.503906 1.148438 9.828125 1.484375 L 28.339844 19.996094 L 9.828125 38.503906 C 9.480469 38.839844 9.472656 39.390625 9.804688 39.734375 C 10.140625 40.078125 10.691406 40.089844 11.035156 39.757812 C 11.042969 39.75 11.050781 39.742188 11.054688 39.734375 L 30.183594 20.609375 C 30.519531 20.269531 30.519531 19.71875 30.183594 19.378906 Z M 11.058594 0.253906'
      }
    )

    element.dispatchEvent(
      new CustomEvent('splide:init', { detail: { splide } })
    )

    const splideRoot = splide.root as HTMLDivElement

    function createButton(
      className: string,
      label: string,
      onClick: () => void
    ) {
      const buttonEl = document.createElement('button')

      buttonEl.className = className
      buttonEl.type = 'button'
      buttonEl.innerHTML = label
      buttonEl.onclick = onClick

      return buttonEl
    }

    // Customize the pagination
    function createControlButton(
      className: string,
      label: string,
      onClick: () => void
    ) {
      const liEl = document.createElement('li')

      liEl.className = 'splide__pagination__control'
      liEl.append(createButton(className, label, onClick))

      return liEl
    }

    const addPaginationPrevNextButtons = () => {
      const splidePagination = splideRoot.querySelector('.splide__pagination')

      if (splidePagination) {
        const arrows = splide.Components.Arrows.arrows

        const prevButtonEl = createControlButton(
          'splide__pagination__arrow splide__pagination__prev',
          arrows.prev.innerHTML,
          () => splide.go('<')
        )

        splidePagination.prepend(prevButtonEl)

        const nextButtonEl = createControlButton(
          'splide__pagination__arrow splide__pagination__next',
          arrows.next.innerHTML,
          () => splide.go('>')
        )

        splidePagination.append(nextButtonEl)
      }
    }

    splide.on('pagination:mounted', addPaginationPrevNextButtons)

    splide.mount()

    // Add light-box
    const lightboxButtonEl = createButton(
      'splide__lightbox',
      `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 482.239 482.239" width="40" height="40">
        <path d="m0 17.223v120.56h34.446v-103.337h103.337v-34.446h-120.56c-9.52 0-17.223 7.703-17.223 17.223z"/>
        <path d="m465.016 0h-120.56v34.446h103.337v103.337h34.446v-120.56c0-9.52-7.703-17.223-17.223-17.223z"/>
        <path d="m447.793 447.793h-103.337v34.446h120.56c9.52 0 17.223-7.703 17.223-17.223v-120.56h-34.446z"/>
        <path d="m34.446 344.456h-34.446v120.56c0 9.52 7.703 17.223 17.223 17.223h120.56v-34.446h-103.337z"/>
      </svg>
      `,
      () => {
        const imagesEl = splide.Components.Elements.getSlides().map(slide =>
          slide.slide.querySelector('img')
        )

        if (typeof SimpleLightbox !== 'undefined') {
          const gallery = new SimpleLightbox(imagesEl, {
            sourceAttr: 'src',
            history: false
          })

          gallery.open(imagesEl[splide.index])
        }
      }
    )

    splideRoot.append(lightboxButtonEl)
  }

  function loadScript(src: string, onLoad?: () => void) {
    const script = document.createElement('script')

    if (onLoad) {
      script.onload = onLoad
    }

    script.src = src
    document.body.appendChild(script)
  }

  function loadCSS(href: string) {
    const style = document.createElement('link')

    style.href = href
    style.rel = 'stylesheet'

    document.body.appendChild(style)
  }

  if (typeof Splide === 'undefined') {
    loadScript(
      'https://cdn.jsdelivr.net/npm/@splidejs/splide@latest/dist/js/splide.min.js',
      initCarousel
    )

    loadCSS(
      'https://cdn.jsdelivr.net/npm/@splidejs/splide@latest/dist/css/splide-core.min.css'
    )

    // Add management styles
    const customStyles = document.createElement('style')

    customStyles.type = 'text/css'
    customStyles.appendChild(
      document.createTextNode(`
      .splide__slide.is-active {
        z-index: 1
      }
      .splide__add_button {
        position: absolute;
        top: 50%;
        right: -20px;
        width: 40px;
        height: 40px;
        transform: translateY(-50%);
        border-radius: 50%;
        font-size: 32px;
        border: 0;
        outline: 0;
        background-color: #00B286;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity .3s, background-color .3s;
        z-index: 1;
      }
      .splide__add_button:hover {
        background-color: #008060;
      }
      .splide__slide.is-active::after {
        content: "";
        display: block;
        position: absolute;
        top: 0;
        right: 0;
        width: 2px;
        height: 100%;
        background-color: #00B286;
        opacity: 0;
        transition: opacity .3s;
      }
      .splide__slide.is-active:hover::after {        
        opacity: 1;
      }
      .splide__slide.is-active:hover .splide__add_button {
        opacity: 1;
      }
    `)
    )

    document.body.appendChild(customStyles)
  } else {
    initCarousel()
  }

  if (typeof SimpleLightbox === 'undefined') {
    loadScript(
      'https://cdn.jsdelivr.net/npm/simplelightbox@2.7.0/dist/simple-lightbox.js'
    )

    loadCSS(
      'https://cdn.jsdelivr.net/npm/simplelightbox@2.7.0/dist/simple-lightbox.min.css'
    )
  }
}

export default script
