var critical = require('critical');

critical.generateInline({
  // Your base directory
  base: '../8d1abeffe1/',

  // HTML source file
  src: 'index.src.html',

  // Viewport width
  width: 1024,

  // Viewport height
  height: 768,

  // Target for final HTML output
  htmlTarget: 'gen/index-critical.html',

  // Target for generated critical-path CSS (which we inline)
  styleTarget: 'gen/critical.css',

  // Minify critical-path CSS when inlining
  minify: true,

  // Extract inlined styles from referenced stylesheets
  extract: true
});
