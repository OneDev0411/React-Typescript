export async function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise( (resolve, reject) => {
    let reader = new FileReader()

    // Once a file is successfully readed:
    reader.addEventListener('load',  () => {
      resolve(reader.result as string)
    })

    reader.addEventListener('error', (e) =>{
      reject(e)
    })

    reader.readAsDataURL(file)
  })
}
