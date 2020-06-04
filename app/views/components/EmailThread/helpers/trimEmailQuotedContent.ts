/**
 * Used in email threads to trim quoted contents in long emails.
 * There are two approaches for collapsing quoted contents.
 * 1. finding quoted content chunks and replacing them with a '⚈⚈⚈' button
 * 2. putting only one '⚈⚈⚈' at the end of the email which toggles rendered
 * content between original content and trimmed content (in which the quoted
 * content is removed).
 *
 * The first approach is more flexible in a sense that it multiple pieces of
 * collapsible contents can exist in an email. It's also how gmail implements
 * such feature. But the second approach is simpler in implementation and also
 * there is a big obstacle in for the first approach:
 * We render the whole email content within an iframe (for a whole lot of
 * reasons) and the first approach requires us to move this content toggling
 * logic and UI into the iframe which renders the content, where we don't have
 * react. In other words, we render the content as a black box and there is
 * no clean and easy way to handle such features directly in the content.
 *
 * Checkout [here](https://gitlab.com/rechat/web/issues/3634#developer-note)
 * for more information about implementation decisions.
 * @param htmlContent
 */
export function trimEmailQuotedContent(htmlContent: string): string {
  const el = document.createElement('div')

  el.innerHTML = htmlContent

  const children = Array(...el.children)

  /**
   * The current implementation is so simple. we iterate through the first level
   * children of the email content to find the first element with a classname
   * that contains the word "quote" (which works for gmail-quote, rechat-quote,
   * etc.), or id equal to "appendsonsend" which works for outlook. Then we
   * remove it along with all subsequent children.
   */
  const firstQuotedChild = children.findIndex(childElement =>
    childElement.matches('#appendonsend, [class*="quote"]')
  )

  return firstQuotedChild > -1
    ? children
        .slice(0, firstQuotedChild)
        .map(element => element.outerHTML)
        .join('')
    : htmlContent
}
