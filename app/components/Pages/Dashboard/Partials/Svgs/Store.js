// Map.js
import React, { Component } from 'react'
export default class Map extends Component {
  render() {
    return (
      <svg width={this.props.width || 24} height={this.props.height || 24} viewBox="0 0 24 21" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <title>DAEA0308-705C-4560-A802-2EF0A341BAD2</title>
        <desc>Created with sketchtool.</desc>
        <defs />
        <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <g id="Listing-onboarding-cover-photo-5" transform="translate(-23.000000, -225.000000)">
            <g id="store.2.3.1" transform="translate(23.000000, 223.000000)">
              <g id="Group">
                <g id="Filled_Icon" transform="translate(0.000000, 2.000000)" fill={this.props.color}>
                  <g id="Group">
                    <path d="M5.109,4 L6.107,0 L2.5,0 C2.31,0 2.138,0.106 2.053,0.276 L0.19,4 L5.109,4 L5.109,4 Z" id="Shape" />
                    <polygon id="Shape" points="11 4 10.997 0 7.139 0 6.14 4" />
                    <polygon id="Shape" points="16.857 0 12 0 12.003 4 17.859 4" />
                    <path d="M18.891,4 L23.81,4 L21.948,0.276 C21.862,0.106 21.69,0 21.5,0 L17.889,0 L18.891,4 L18.891,4 Z" id="Shape" />
                    <path d="M17.999,5 L12.003,5 L12,9.217 C13,9.893 15.776,10.727 17.995,8.823 L17.999,5 L17.999,5 Z" id="Shape" />
                    <path d="M4.999,5 L0,5 L0,5.5 C0,8.123 2.871,9.867 4.996,8.547 L4.999,5 L4.999,5 Z" id="Shape" />
                    <path d="M19,5 L19,8.546 C21.106,9.866 24,8.142 24,5.5 L24,5 L19,5 L19,5 Z" id="Shape" />
                    <path d="M11,5 L6,5 L6,8.816 C7.497,10.106 9.194,10.436 11,9.224 L11,5 L11,5 Z" id="Shape" />
                    <g transform="translate(2.000000, 9.000000)">
                      <circle id="Oval" cx="15.5" cy="7.5" r="0.5" />
                      <path d="M16.711,0.54 C14.305,2.671 11.033,2.104 9.503,1.106 C7.264,2.567 5.013,2.066 3.289,0.54 C2.312,1.067 1.22,1.159 0,0.723 L0,11.5 C0,11.776 0.224,12 0.5,12 L19.5,12 C19.776,12 20,11.776 20,11.5 L20,0.723 C18.864,1.129 17.76,1.106 16.711,0.54 L16.711,0.54 Z M10,7.5 C10,7.776 9.776,8 9.5,8 L3.5,8 C3.224,8 3,7.776 3,7.5 L3,3.5 C3,3.224 3.224,3 3.5,3 L9.5,3 C9.776,3 10,3.224 10,3.5 L10,7.5 L10,7.5 Z M17,10.5 C17,10.776 16.776,11 16.5,11 L13.5,11 C13.224,11 13,10.776 13,10.5 L13,3.5 C13,3.224 13.224,3 13.5,3 L16.5,3 C16.776,3 17,3.224 17,3.5 L17,10.5 L17,10.5 Z" id="Shape" />
                    </g>
                  </g>
                </g>
                <g id="Invisible_Shape">
                  <rect id="Rectangle-path" x="0" y="0" width="24" height="24" />
                </g>
              </g>
            </g>
          </g>
        </g>
      </svg>
    )
  }
}
Map.propTypes = {
  color: React.PropTypes.string
}