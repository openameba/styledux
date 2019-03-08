import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import autoExternal from 'rollup-plugin-auto-external';

const NAME = 'Styledux';

const config = {
  input: 'src/index.js',
  output: {
    name: NAME,
    indent: false,
    exports: 'named',
    globals: {
      react: 'React',
      'react-router': 'ReactRouter'
    }
  },
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    resolve({
      jsnext: true
    }),
    commonjs({
      include: /node_modules/
    }),
    autoExternal()
  ]
};

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
    uglify({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false
      }
    })
  );
}

export default config;
