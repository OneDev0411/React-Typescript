import { ReadStream } from 'fs-extra'

import Fetch from '@app/services/fetch'
import { Progress } from '@app/services/fetch/types'

export async function uploadMedia(
  dealId: UUID,
  fileObject: Blob | Buffer | ReadStream | string | boolean | number,
  fileName: Optional<string> = undefined,
  order = 0,
  uploadProgressCallback: Nullable<Progress> = null
) {
  const result = await new Fetch({
    progress: uploadProgressCallback,
    useReferencedFormat: true
  })
    .upload(`/deals/${dealId}/gallery/items`)
    .attach('file', fileObject, fileName)
    .field({ order })

  return result.body.data
}
