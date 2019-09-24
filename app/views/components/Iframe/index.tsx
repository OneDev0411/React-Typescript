import * as React from 'react'
import { EventHandler, HTMLProps, useEffect, useRef, useState } from 'react'

interface Props extends HTMLProps<HTMLIFrameElement> {
  /**
   * The title of the iframe. iframe elements must have a unique title property
   * for a11y
   */
  title: string
  /**
   * If true, the height of the iframe will be set based on the content height,
   * so that it doesn't scroll. Defaults to true.
   */
  autoHeight?: boolean

  /**
   * If true, width will be set to 100%. Defaults to true.
   */
  fullWidth?: boolean

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
  onLoad: receivedOnLoad,
  ...props
}: Props) {
  const ref = useRef<HTMLIFrameElement | null>(null)
  const [height, setHeight] = useState<number | undefined>(undefined)

  const updateHeight = () => {
    if (
      ref.current &&
      ref.current.contentDocument &&
      ref.current.contentDocument.documentElement
    ) {
      setHeight(ref.current.contentDocument.documentElement.offsetHeight)
    }
  }

  // Updating height only on load, causes a flicker. with this effect,
  // we prevent it
  useEffect(() => {
    setTimeout(updateHeight)
  }, [props.srcDoc])

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

  return (
    <iframe
      ref={ref}
      title={title}
      frameBorder={0}
      onLoad={onLoad}
      height={autoHeight ? height : undefined}
      width={fullWidth ? '100%' : undefined}
      {...props}
    />
  )
}
