import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import external from 'rollup-plugin-peer-deps-external'
import postcss from 'rollup-plugin-postcss'
import scss from 'rollup-plugin-scss'
import resolve from 'rollup-plugin-node-resolve'
import url from 'rollup-plugin-url'
import svgr from '@svgr/rollup'
import sass from 'node-sass'
import autoprefixer from 'autoprefixer'

import pkg from './package.json'

export default {
  input: 'src/index.js',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true
    }
  ],
  plugins: [
    external(),
    postcss({
      preprocessor: (content, id) => new Promise((resolve, reject) => {
        const result = sass.renderSync({ file: id })
        resolve({ code: result.css.toString() })
      }),
      plugins: [
        autoprefixer
      ],
      sourceMap: true,
      extract: false,
      extensions: ['.scss', '.css']
    }),
    url(),
    svgr(),
    babel({
      runtimeHelpers: true,
      exclude: 'node_modules/**',
      plugins: ['external-helpers', 'transform-runtime']
    }),
    resolve(),
    commonjs()
  ]
}
