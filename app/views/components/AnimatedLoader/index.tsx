import * as React from 'react'

export function AnimatedLoader(props) {
  return (
    <svg viewBox="0 0 41 40" fill="none" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M39.716 18.535c.211.314.355.648.425.991-.14-.322-.285-.655-.425-.99z"
        stroke="#221F1F"
        style={{
          animation:
            'RLdgLSDc_draw_0 1000ms ease-in-out 0ms infinite,RLdgLSDc_fade 1000ms linear 0ms infinite'
        }}
        strokeDasharray="3 5"
        strokeDashoffset={4}
        opacity={0.68}
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.874 8.765C12.61 2.22 22.338 1.009 29.501 5.95c7.164 4.94 9.49 14.464 5.41 22.15-4.08 7.686-13.272 11.097-21.378 7.932C5.427 32.867.978 24.13 3.186 15.713a1.289 1.289 0 00-.634-1.469l-.035-.017a1.285 1.285 0 00-1.844.807 19.738 19.738 0 0024.814 23.932C35.91 35.794 41.79 24.772 38.62 14.347 35.464 3.975 24.533-1.909 14.138 1.168a19.59 19.59 0 00-9.204 5.883 1.285 1.285 0 00.354 1.983l.036.017c.521.272 1.16.154 1.55-.286z"
        stroke="#091933"
        style={{
          animation:
            'RLdgLSDc_draw_1 2900ms ease-in-out 0ms infinite,RLdgLSDc_fade 2900ms linear 0ms infinite'
        }}
        strokeDasharray="223 225"
        strokeDashoffset={224}
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.273 10.687a1.543 1.543 0 112.722 1.455 1.543 1.543 0 01-2.722-1.455z"
        stroke="#39CCAA"
        style={{
          animation:
            'RLdgLSDc_draw_2 2900ms ease-in-out 0ms infinite,RLdgLSDc_fade 2900ms linear 0ms infinite'
        }}
        strokeDasharray="10 12"
        strokeDashoffset={11}
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M30.223 15.576l-8.11 8.1-3.352-3.35-2.878 2.878s3.844 3.873 4.733 4.715c.888.843 2.41.613 3.186-.18.425-.442 9.288-9.292 9.288-9.292l-2.867-2.87z"
        stroke="#39CCAA"
        style={{
          animation:
            'RLdgLSDc_draw_3 2900ms ease-in-out 0ms infinite,RLdgLSDc_fade 2900ms linear 0ms infinite'
        }}
        strokeDasharray="48 50"
        strokeDashoffset={49}
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.225 13.349c-.283.262-3.423 3.44-3.423 3.44v-1.568H11.08v4.287l-3.292 3.306 2.881 2.882 8.092-8.11 3.349 3.349 2.885-2.882s-4.514-4.524-4.684-4.73c-1.019-.934-2.198-.792-3.086.026z"
        stroke="#091933"
        style={{
          animation:
            'RLdgLSDc_draw_4 2900ms ease-in-out 0ms infinite,RLdgLSDc_fade 2900ms linear 0ms infinite'
        }}
        strokeDasharray="53 55"
        strokeDashoffset={54}
      />
      <style data-made-with="vivus-instant">
        {
          '@keyframes RLdgLSDc_draw{to{stroke-dashoffset:0}}@keyframes RLdgLSDc_fade{0%,86.20689655172414%{stroke-opacity:1}to{stroke-opacity:0}}@keyframes RLdgLSDc_draw_0{0%{stroke-dashoffset:4}.6049606775559588%,to{stroke-dashoffset:0}}@keyframes RLdgLSDc_draw_1{.6049606775559588%{stroke-dashoffset:224}34.48275862068966%,to{stroke-dashoffset:0}}@keyframes RLdgLSDc_draw_2{34.48275862068966%{stroke-dashoffset:11}36.14640048396854%,to{stroke-dashoffset:0}}@keyframes RLdgLSDc_draw_3{36.14640048396854%{stroke-dashoffset:49}43.55716878402904%,to{stroke-dashoffset:0}}@keyframes RLdgLSDc_draw_4{43.55716878402904%{stroke-dashoffset:54}51.724137931034484%,to{stroke-dashoffset:0}}'
        }
      </style>
    </svg>
  )
}
