// Brand.js
import merge from 'merge'

import AppStore from '../stores/AppStore'

class Brand {
  constructor() {
    // this.checkBranding()
  }

  color(name, def, brand = AppStore.data.brand) {
    if (!brand) {
      return def
    }

    do {
      const palette = brand.palette

      if (palette && palette[name]) {
        return palette[name]
      }

      brand = brand.parent
    } while (brand)

    return def
  }

  asset(name, def, brand = AppStore.data.brand) {
    if (!brand) {
      return def
    }

    do {
      const assets = brand.assets

      if (assets && assets[name]) {
        return assets[name]
      }

      brand = brand.parent
    } while (brand)

    return def
  }

  message(name, def, brand = AppStore.data.brand) {
    if (!brand) {
      return def
    }

    do {
      const messages = brand.messages

      if (messages && messages[name]) {
        return messages[name]
      }

      brand = brand.parent
    } while (brand)

    return def
  }

  flatten(brand) {
    if (!brand) {
      return null
    }

    let new_brand = { ...brand }
    const brands = [new_brand]

    while (new_brand.parent) {
      brands.push(new_brand.parent)
      new_brand = new_brand.parent
    }

    brands.reverse()

    const merged = {}

    brands.forEach(brand_loop => {
      merge.recursive(merged, brand_loop)
    })

    return merged
  }
}

export default new Brand()
