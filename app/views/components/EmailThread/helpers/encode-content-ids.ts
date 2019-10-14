import { convertToAbsoluteAttachmentUrl } from './convert-to-absolute-attachment-url'

/**
 * Encodes all urls to attachments into "cid:[cid]".
 * More information: https://tools.ietf.org/html/rfc2392
 * @param attachments
 * @param content
 */
export function encodeContentIds(
  attachments: IEmailAttachment[],
  content: string
) {
  return attachments
    .filter(attachment => attachment.cid)
    .reduce(
      (body, attachment) =>
        body.replace(
          convertToAbsoluteAttachmentUrl(attachment.url),
          `cid:${attachment.cid}`
        ),
      content || ''
    )
}
