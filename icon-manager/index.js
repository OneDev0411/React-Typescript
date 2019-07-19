import fs from 'fs'
import path from 'path'

import rimraf from 'rimraf'

import nunjucks from 'nunjucks'
import sass from 'node-sass'

import open from 'opn'

const ICONS_PATH = path.join(__dirname, '../app/views/components/SvgIcons')
const DESTINATION = path.join(__dirname, 'dist/')

/**
 * checks a dir is directory or not
 * @param {string} dir - directory name
 */
function isDirectory(dir) {
  try {
    return fs.lstatSync(dir).isDirectory()
  } catch (e) {
    return false
  }
}

/**
 * return file types of an icon
 * @param {string} name - icon name
 */
function getIconFiles(name) {
  const list = fs.readdirSync(path.join(ICONS_PATH, name))

  return {
    svg: list.find(file => path.extname(file) === '.svg'),
    react: list.find(
      file => path.extname(file) === '.js' && !file.includes('.test')
    )
  }
}

/**
 * returns list of all icons in the web app
 */
function getIconsList() {
  return fs
    .readdirSync(ICONS_PATH)
    .filter(name => isDirectory(path.join(ICONS_PATH, name)))
    .map(name => ({
      name,
      path: path.join(ICONS_PATH, name),
      ...getIconFiles(name)
    }))
}

/**
 * copies icons into the dest dir
 * @param {Array} list - list of all icons
 */
function copyIcons(list) {
  const iconsDir = path.join(__dirname, 'dist/icons')

  fs.mkdirSync(iconsDir)

  list.forEach(icon => {
    if (!icon.svg) {
      console.error(`There is no svg file for "${icon.name}" icon`)

      return
    }

    fs.copyFile(
      path.join(icon.path, icon.svg),
      path.join(iconsDir, `${icon.name}-${icon.svg}`),
      () => null
    )
  })
}

/**
 * renders template and copies that into dest dir
 */
function createTemplate(icons) {
  nunjucks.configure({ autoescape: true })

  const response = nunjucks.render(
    path.join(__dirname, './src/template.html'),
    { icons }
  )

  fs.writeFileSync(path.join(DESTINATION, 'index.html'), response)
}

/**
 * generate css file from sass and copy that into dist dir
 */
function createStyles() {
  const result = sass.renderSync({
    file: path.join(__dirname, './src/styles.scss')
  })

  fs.writeFileSync(path.join(DESTINATION, 'styles.css'), result.css)
}

export default function build() {
  // clean dist file
  rimraf.sync(path.join(DESTINATION, '*'))

  // get list of all icons
  const icons = getIconsList()

  // create html template file
  createTemplate(icons)

  // create styles (sass -> css)
  createStyles()

  // copy all icons
  copyIcons(icons)

  open(path.join(DESTINATION, 'index.html'))
}

build()
