module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'header-case': [0],
    'type-enum': [
      2,
      'always',
      // Defaults
      [
        'build',
        'chore',
        'ci',
        'docs',
        'feat',
        'fix',
        'perf',
        'refactor',
        'revert',
        'style',
        'test',

        // Custom
        'bic',
        'wip_feat',
        'wip_fix'
      ]
    ]
  }
}
