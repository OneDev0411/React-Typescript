const getBrand = (id, cb) => {
  setTimeout( () => {
    cb(null, {
      id,
      hostname: 'http://' + id
    })
  }, 2000)
}

function wrapper(id) {
  getBrand(id, (err, b) => {
    if(err)
      throw err

    it.next(b)
  })
}

const createUrl = function* () {
  const options = yield
  console.log('11', options)

  const brand = yield wrapper(options.brand)
  console.log('>', brand)
  return brand
}

const it = createUrl()
it.next()

it.next({
  uri: 'foo',
  brand: 5
})

console.log(it)