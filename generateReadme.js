const fs = require('fs')
const path = require('path')

const ROOT = __dirname

const IGNORE = new Set(['.git', '.gitignore', 'node_modules', '.DS_Store', '.github', 'generateReadme.js', 'README.md'])

function makeLinks(dir, files) {
  return files
    .map((file) => {
      const fullPath = path.join(dir, file.name)
      let relPath = path.relative(ROOT, fullPath).replace(/\\/g, '/')
      relPath = relPath.split(' ').join('%20') // encode spaces
      return `[${file.name}](${relPath})`
    })
    .join(', ')
}

function generateTree(dir, depth = 0) {
  const items = fs.readdirSync(dir, { withFileTypes: true })

  const folders = []
  const files = []

  for (const item of items) {
    if (IGNORE.has(item.name)) continue
    if (item.isDirectory()) folders.push(item)
    else files.push(item)
  }

  let out = ''

  if (depth === 0 && files.length > 0) {
    out += makeLinks(dir, files) + '\n\n'
  }
  
  for (const folder of folders) {
    const indent = '  '.repeat(depth)
    out += `${indent}- **${folder.name}/**\n`

    const fullPath = path.join(dir, folder.name)
    out += generateTree(fullPath, depth + 1)
  }

  if (depth > 0 && files.length > 0) {
    const indent = '  '.repeat(depth)
    out += `${indent}${makeLinks(dir, files)}\n`
  }

  return out
}

const content = `# 📚 DSA Snippets Repository
### Because I care about my fellow developers' precious time (◔◡◔)

#### Actually it's for my personal needs ✪ ω ✪
---

${generateTree(ROOT)}
`

fs.writeFileSync(path.join(ROOT, 'README.md'), content)
console.log('README.md updated!')
