import branch from 'branch-sdk'
const branch_key = 'key_live_hhfGKmCFN6reXdK3f4uJBmjbqEdwk2TU'
let options
branch.init(
  branch_key,
  options,
  (err, data) => {
    console.log(err, data)
  }
);