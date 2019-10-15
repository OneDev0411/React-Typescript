import { convertToAbsoluteAttachmentUrl } from './convert-to-absolute-attachment-url'

/**
 * Decodes all "cid:[cid]" into real urls, based on attachments.
 * More information: https://tools.ietf.org/html/rfc2392
 * @param attachments
 * @param content
 */
export function decodeContentIds(
  attachments: IEmailAttachment[],
  content: string
): string {
  return attachments
    .filter(attachment => attachment.cid)
    .reduce(
      (body, attachment) =>
        body.replace(
          `cid:${attachment.cid}`,
          convertToAbsoluteAttachmentUrl(attachment.url)
        ),
      content || ''
    )
}
