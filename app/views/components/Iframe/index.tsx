import * as React from 'react'
import {
  EventHandler,
  HTMLProps,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import sanitizeHtml from 'sanitize-html'

interface Props extends HTMLProps<HTMLIFrameElement> {
  /**
   * The title of the iframe. iframe elements must have a unique title property
   * for a11y
   */
  title: string
  /**
   * If true, the height of the iframe will be set based on the content height,
   * so that it doesn't scroll.
   * Defaults to true.
   */
  autoHeight?: boolean

  /**
   * If true, width will be set to 100%.
   * Defaults to true.
   */
  fullWidth?: boolean

  /**
   * Sanitize srcDoc before setting it.
   * Defaults to true.
   */
  sanitize?: boolean

  /**
   * If defined, sets target for all links in content document.
   * Defaults to '_blank'
   */
  linkTarget?: HTMLProps<HTMLLinkElement>['target']
}

/**
 * Iframe component with a couple of higher level features like:
 * - Full width
 * - Auto height based on content
 * - Setting target to _blank (or other values) for all links inside.
 *
 */
export function Iframe({
  autoHeight = true,
  title,
  fullWidth = true,
  linkTarget = '_blank',
  srcDoc,
  sanitize,
  height: passedHeight,
  onLoad: receivedOnLoad,
  ...props
}: Props) {
  const ref = useRef<HTMLIFrameElement>(null)
  const [height, setHeight] = useState<
    HTMLProps<HTMLIFrameElement>['height'] | undefined
  >(passedHeight)

  const updateHeight = () => {
    if (
      ref.current &&
      ref.current.contentDocument &&
      ref.current.contentDocument.body
    ) {
      const documentElement = ref.current.contentDocument.documentElement

      setHeight(documentElement.scrollHeight)
    }
  }

  // Updating height only on load, causes a flicker (onLoad is usually too
  // late). So we update height when document content is changed
  useEffect(() => {
    // calling without setTimeout, or with 0 timeout doesn't work well.
    // I know this 50 is super annoying and ugly but it seems it works fine
    // even in low end devices, and even if it doesn't work, the one in
    // onLoad will cover it.
    setTimeout(updateHeight, 50)
  }, [srcDoc])

  const onLoad: EventHandler<any> = (...args) => {
    if (
      ref.current &&
      ref.current.contentDocument &&
      ref.current.contentDocument.documentElement
    ) {
      updateHeight()

      if (linkTarget) {
        ref.current.contentDocument.querySelectorAll('a').forEach(element => {
          element.setAttribute('target', linkTarget)
        })
      }

      if (receivedOnLoad) {
        receivedOnLoad(...args)
      }
    }
  }

  const appliedSrcDoc = useMemo(
    () => (sanitize && srcDoc ? sanitizeHtml(srcDoc) : srcDoc),
    [sanitize, srcDoc]
  )

  return (
    <iframe
      ref={ref}
      title={title}
      frameBorder={0}
      onLoad={onLoad}
      height={height}
      width={fullWidth ? '100%' : undefined}
      {...props}
      srcDoc={appliedSrcDoc}
    />
  )
}
