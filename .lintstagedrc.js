const path = require('path')

const buildEslintCommand = filenames => `eslint --fix ${filenames.map(f => path.relative(process.cwd(), f)).join(' ')}`

module.exports = {
  '*.{ts,tsx}': [buildEslintCommand],
  '*.{ts,tsx,md,json}': 'prettier --write',
}
