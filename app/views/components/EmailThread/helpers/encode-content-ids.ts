/**
 * Encodes all urls to attachments into "cid:[cid]".
 * More information: https://tools.ietf.org/html/rfc2392
 * @param attachments
 * @param content
 */
export function encodeContentIds(
  attachments: IEmailAttachment[],
  content: string
): string {
  return attachments
    .filter(attachment => attachment.cid)
    .reduce(
      (body, attachment) =>
        body.replace(attachment.url, `cid:${attachment.cid}`),
      content || ''
    )
}
