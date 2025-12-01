const fs = require('fs')
const path = require('path')

const ROOT = __dirname

const IGNORE = new Set([
  '.git',
  '.gitignore',
  'node_modules',
  '.DS_Store',
  '.github',
  'generateReadme.js',
])

function generateTree(dir, prefix = '') {
  const items = fs.readdirSync(dir, { withFileTypes: true })

  let out = ''

  for (const item of items) {
    if (IGNORE.has(item.name)) continue;
    const fullPath = path.join(dir, item.name)
    let relPath = path.relative(ROOT, fullPath).replace(/\\/g, '/')

    relPath = relPath.split(' ').join('%20')

    if (item.isDirectory()) {
      out += `${prefix}- **${item.name}/**\n`
      out += generateTree(fullPath, prefix + '  ')
    } else {
      out += `${prefix}- [${item.name}](${relPath})\n`
    }
  }
  return out
}

const content = `# Code Snippets
### Bcz I care about my fellow developers' precious time (◔◡◔)


actually its for my personal needs ✪ ω ✪
##
but yes you guys are also welcomed anytime :D


# 📚 DSA Snippets Repository

Automatically generated file index.

---

${generateTree(ROOT)}
`

fs.writeFileSync(path.join(ROOT, 'README.md'), content)

console.log('README.md updated!')
