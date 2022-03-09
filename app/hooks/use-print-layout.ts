import { useEffect } from 'react'

type PrintLayout = 'landscape' | 'portrait'

function usePrintLayout(layout: PrintLayout): void {
  useEffect(() => {
    if (!document) {
      return
    }

    const printLayoutStyleElement = document.createElement('style')

    printLayoutStyleElement.innerHTML = `@page { size: ${layout}; }`
    printLayoutStyleElement.setAttribute('type', 'text/css')
    printLayoutStyleElement.setAttribute('media', 'print')

    document.head.appendChild(printLayoutStyleElement)

    return () => {
      printLayoutStyleElement.remove()
    }
  }, [layout])
}

export default usePrintLayout
