import { CustomBlockFn } from 'draft-js-import-html'

export const blockLevelLinkCustomBlockFn: CustomBlockFn = element => {
  const parentElement = element.parentElement

  if (
    element.tagName.toLowerCase() === 'figure' /* atomic blocks */ &&
    parentElement instanceof HTMLAnchorElement
  ) {
    return {
      data: {
        href: parentElement.href,
        title: parentElement.title
      }
    }
  }
}
