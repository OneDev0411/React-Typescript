// test/components.js
require('./utils/dom-mock')('<html><body></body></html>')
import jsdom from 'mocha-jsdom'
import { expect } from 'chai'
import React from 'react'
import TestUtils from 'react-addons-test-utils'

// Components
import Home from '../app/components/pages/Home'

// Write tests