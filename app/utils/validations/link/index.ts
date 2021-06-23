/**
   * Check if a string is a URL
   * @param {string} value - url
   */

export const isLink = (value: string) => {
  if(!value){
    return 'Invalid Link.'
  }
  
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator

  const result= !!pattern.test(value)

  if (!result) {
    return 'Invalid Link.'
  }
}
