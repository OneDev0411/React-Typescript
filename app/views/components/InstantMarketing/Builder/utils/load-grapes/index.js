export async function loadGrapesjs() {
  return import('./load-chunks' /* webpackChunkName: "grapesjs-loader" */)
}
