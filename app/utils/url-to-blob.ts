export function urlToBlob(url: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then(res => res.blob())
      .then(resolve)
      .catch(reject)
  })
}
