const fs = require('fs');

const modifyJson = (path, fn) => {
  const data = require(path);

  fn(data);

  fs.writeFileSync(
    path, 
    JSON.stringify(data, null, 2), 
    'utf8'
  );
};

const workingDirectory = process.cwd();
const version = process.argv[2].startsWith('v') ? process.argv[2] : `v${process.argv[2]}`;

console.log('Version:', version);

fs.writeFileSync(`${workingDirectory}/.version`, version, 'utf8');

modifyJson(
  `${workingDirectory}/perehliadach-app/src-tauri/tauri.conf.json`,
  config => config.package.version = version.substring(1)
);

modifyJson(
  `${workingDirectory}/perehliadach-app/package.json`,
  config => config.version = version.substring(1)
);
