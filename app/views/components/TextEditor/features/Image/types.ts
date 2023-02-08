export interface ImageFeatureProps {
  /**
   * an optional function to be used when an image is
   * added to the editor. It should upload the image and return the promise
   * of the uploaded image url. The src of the image in the editor will be
   * uploaded to that uploaded image url.
   * @param file
   */
  uploadImage?: (file: File) => Promise<string>
  allowGif?: boolean
}
