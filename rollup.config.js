import fs from 'fs';
import { readdirSync } from 'node:fs'
import path from 'path';
import typescript from 'rollup-plugin-typescript2';
import workspacesRun from 'workspaces-run';
import copy from 'rollup-plugin-copy';
// import dts from 'rollup-plugin-dts';
// import linaria from '@linaria/rollup';
// import css from 'rollup-plugin-css-only';


const { join } = path
const { statSync } = fs
const isDirectory = path => statSync(path).isDirectory();
const getDirectories = path =>
    readdirSync(path).map(name => join(path, name)).filter(isDirectory);

const isFile = path => statSync(path).isFile();  
const getFiles = path =>
    readdirSync(path).map(name => join(path, name)).filter(isFile);

const getFilesRecursively = (path) => {
    let dirs = getDirectories(path);
    let files = dirs
        .map(dir => getFilesRecursively(dir)) // go through each directory
        .reduce((a,b) => a.concat(b), []);    // map returns a 2d array (array of file arrays) so flatten
    return files.concat(getFiles(path));
};

async function main() {
  const copyTargets = []
  const plugins = [
    typescript({
      useTsconfigDeclarationDir: true,
    }),
    copy({ targets: copyTargets })
  ];

  const results = [];
  let packages = [];

  await workspacesRun({ cwd: __dirname, orderByDeps: true }, async (pkg) => {
    if (!pkg.config.private) {
      packages.push(pkg);
    }
  });

  if (!process.env.TARGET) {
    console.log('Found the following packages:')
    packages.forEach((pkg) => console.log('- ', pkg.name))
  } else {
    packages = packages.filter((pkg) => pkg.name === process.env.TARGET)
    if (!packages.length) throw new Error(`No package with name "${process.env.TARGET}". `)
  }

  packages.forEach((pkg) => {
    const basePath = path.relative(__dirname, pkg.dir)
    const outputPath = basePath.replace('packages/', 'dist/');
    let copyPath = path.join(basePath, 'copy');

    if(fs.existsSync(copyPath)) {
      copyTargets.push({ src: `${copyPath}/*`, dest: outputPath })
    }
    ['package.json', 'README.md'].forEach((fileName) => {
      const file = path.join(basePath, fileName)
      if(fs.existsSync(file)) {
        copyTargets.push({ src: file, dest: outputPath })
      } else if (fileName === 'README.md') {
        copyTargets.push({ src: 'README.md', dest: outputPath })
      }
    })

    const fsBased = true

    const configExports = pkg.config.exports || {'.': {
      types: pkg.config.types,
      module: pkg.config.module,
      default: pkg.config.main,
    }}

    let entries = Object.keys(configExports)

    if(fsBased) {
      const srcPath = path.join(basePath, 'src')
      const files = getFilesRecursively(srcPath);
      entries = files.map(s => './' + path.relative(srcPath, s).replace(/\.[^/.]+$/, ""))
    }

    entries.forEach((entry) => {
      const externalLookup = [
        ...Object.keys(pkg.config.dependencies || []),
        ...Object.keys(pkg.config.peerDependencies || []),
        ...entries.filter(s => s !== '.' || s !== entry)
      ];
      const external = fsBased ? () => true : (name) => externalLookup.includes(/^((?:\.\/)?(?:.*?))(?:\/|$)/.exec(name)[1])

      if(entry === '.') entry = 'index'

      const input = path.join(basePath, 'src', entry + '.tsx');
      const output = []

      if(fsBased || configExports[entry].default) {
        output.push({
          file: path.join(outputPath, entry + '.js'),
          format: 'esm', // !!!
        })
      }
      
      // if(fsBased || configExports[entry].module) {
      //   output.push({
      //     file: path.join(outputPath, entry + '.esm.js'),
      //     format: 'esm',
      //   })
      // }
      
      results.push({
        input,
        output,
        external,
        plugins,
      });

      copyTargets.push({
        src: path.join('dist/ts-out', basePath, `src/${entry}.d.ts`),
        dest: path.join(outputPath, entry.replace(/\/[^/.]+$/, "")),
      })

      // if(fsBased || configExports[entry].types) {
      //   results.push({
      //     input: path.join('dist/ts-out', basePath, `src/${entry}.d.ts`),
      //     output: { file: path.join(outputPath, `${entry}.d.ts`), format: 'es' },
      //     external,
      //     plugins: [dts({})],
      //   });
      // }
      
    })
    
  });
  return results;
}

export default main();
