module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        loose: true,
        modules: process.env.BABEL_ENV === "es" ? false : "commonjs"
      },
    ],
    "@babel/preset-stage-1",
    "@babel/preset-react"
  ]
};
