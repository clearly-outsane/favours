import ReactDOMServer from 'react-dom/server';
import fs from 'fs';
import path from 'path';

import theme from '~/layout/theme';
import * as Templates from '~/templates';

const buildDir = path.resolve(__dirname, '../build');

const renderedTemplates = Object.keys(Templates).map((template) => {
  let source = ReactDOMServer.renderToString(Templates[template]());

  source = source.replace(/&quot;/g, '\'');

  source = `<div id="root">${source}</div>`;

  return {
    name: template,
    source,
  };
});

const renderedTheme = ReactDOMServer.renderToString(theme()).replace(/&quot;/g, '\'');

if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir);
  fs.mkdirSync(path.resolve(buildDir, 'templates'));
  fs.mkdirSync(path.resolve(buildDir, 'layout'));
  fs.mkdirSync(path.resolve(buildDir, 'assets'));
}

renderedTemplates.map(template => fs.writeFileSync(path.resolve(buildDir, 'templates', `${template.name.toLowerCase()}.liquid`), template.source));
fs.writeFileSync(path.resolve(buildDir, 'layout', 'theme.liquid'), renderedTheme);
