declare const Splide: any
declare const SimpleLightbox: any

function script() {
  const element: HTMLElement = this
  const elementId = element.id

  function initCarousel() {
    const slider = new Splide(
      element instanceof Element ? element : `#${elementId}`,
      {
        type: 'loop',
        padding: {
          left: 0,
          right: '6rem'
        },
        height: '600px',
        classes: {
          arrows: 'splide__arrows',
          arrow: 'splide__arrow',
          prev: 'splide__arrow--prev',
          next: 'splide__arrow--next'
        }
      }
    ).mount()

    const sliderRoot = slider.root as HTMLDivElement

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
    const sliderPagination = sliderRoot.querySelector('.splide__pagination')

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

    if (sliderPagination) {
      const arrows = slider.Components.Arrows.arrows

      const prevButtonEl = createControlButton(
        'splide__pagination__arrow splide__pagination__prev',
        arrows.prev.innerHTML,
        () => slider.go('<')
      )

      sliderPagination.prepend(prevButtonEl)

      const nextButtonEl = createControlButton(
        'splide__pagination__arrow splide__pagination__next',
        arrows.next.innerHTML,
        () => slider.go('>')
      )

      sliderPagination.append(nextButtonEl)
    }

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
        if (typeof SimpleLightbox !== 'undefined') {
          const imagesEl = Array.from(
            element.querySelectorAll<HTMLImageElement>(
              'img.splide__image[data-src]'
            )
          )

          const gallery = new SimpleLightbox(imagesEl, {
            sourceAttr: 'data-src',
            history: false
          })

          gallery.open()
        }
      }
    )

    sliderRoot.append(lightboxButtonEl)
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

  if (typeof Splide == 'undefined') {
    loadScript(
      'https://cdn.jsdelivr.net/npm/@splidejs/splide@latest/dist/js/splide.min.js',
      initCarousel
    )

    // 'https://cdn.jsdelivr.net/npm/@splidejs/splide@latest/dist/css/splide.min.css'
    loadCSS(
      'https://cdn.jsdelivr.net/npm/@splidejs/splide@latest/dist/css/splide-core.min.css'
    )

    loadScript(
      'https://cdn.jsdelivr.net/npm/simplelightbox@2.7.0/dist/simple-lightbox.js'
    )

    loadCSS(
      'https://cdn.jsdelivr.net/npm/simplelightbox@2.7.0/dist/simple-lightbox.min.css'
    )

    // custom style for test
    const customStyle = document.createElement('style')

    customStyle.type = 'text/css'
    customStyle.appendChild(
      document.createTextNode(`
      :root {
        --splide-pagination-height: 60px;
      }
      
      .splide {
        margin-bottom: var(--splide-pagination-height);
      }
      
      .splide__arrow {
        position: absolute;
        z-index: 1;
        top: 50%;
        transform: translateY(-50%);
        width: 2em;
        height: 2em;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        padding: 0;
        opacity: .7;
        background: #ccc;
      }
      
      .splide__arrow--prev {
        left: 1em;
      }
      
      .splide__arrow--next {
        right: 1em;
      }
      
      .splide__arrow--prev svg, .splide__pagination__prev svg {
        transform: scaleX(-1);
      }
      
      .splide__pagination {
        counter-reset: pslide-counter 0;
        display: inline-flex;
        align-items: center;
        width: 95%;
        flex-wrap: wrap;
        justify-content: center;
        margin: 0;
        position: absolute;
        z-index: 1;
        left: 50%;
        transform: translateX(-50%);
        padding: 0;
        bottom: calc(-1 * var(--splide-pagination-height));
        height: var(--splide-pagination-height);          
      }
      
      .splide__pagination .splide__pagination__page {
        counter-increment: pslide-counter;
      }
      
      .splide__pagination li:first-child:after {
        content: "01";
      }
      
      .splide__pagination li:last-child:before {
        content: counter(pslide-counter, decimal-leading-zero);
      }
      
      
      .splide__pagination__arrow {
        margin: 0 10px;
        border: 0;
        background: transparent;
        outline: none;
      }
      
      .splide__pagination__arrow svg {
        width: 1em;
        height: 1em;
        font-size: 20px;
      }
      
      .splide__pagination li.splide__pagination__control {
        display: flex;
        align-items: center;
      }
      
      .splide__pagination__page {
        width: 30px;
        height: 6px;
        background: lightgray;
        border: 0;
        margin: 0 2px;
        outline: none;
      }
      
      .splide__pagination__page.is-active {
        background: cadetblue;
      }
      
      .splide__image {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .splide__lightbox {
        position: absolute;
        top: 1rem;
        right: 1rem;
        z-index: 1;
      }

      .splide__lightbox svg {
        width: 1em;
        height: 1em;
        font-size: 24px;
      }
    `)
    )
    document.body.appendChild(customStyle)
  } else {
    initCarousel()
  }
}

export default script
