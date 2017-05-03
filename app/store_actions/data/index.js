// constants
export const types = {
  UPDATE_APP: 'UPDATE_APP'
}

export function updateApp(data) {
  return {
    type: types.UPDATE_APP,
    data
  }
}
