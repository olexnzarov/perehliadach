const fs = require('fs');

const workingDirectory = process.cwd();
const previousVersionsFile = `${workingDirectory}/.versions/previous-versions.json`;
const latestVersionFile = `${workingDirectory}/.versions/latest-version.json`;

if (fs.existsSync(latestVersionFile)) {
  const latestVersion = require(latestVersionFile);
  const previousVersions = require(previousVersionsFile);

  previousVersions.unshift(latestVersion);

  fs.writeFileSync(
    previousVersionsFile, 
    JSON.stringify(previousVersions, null, 2), 
    'utf8'
  );
}

const releasesUrl = 'https://github.com/alexnzarov/perehliadach/releases';
const version = process.argv[2].startsWith('v') ? process.argv[2] : `v${process.argv[2]}`;

const release = {
  version,
  pub_date: (new Date()).toISOString(),
  platforms: {
    ['windows-x86_64']: {
      signature: '', // GET `${releasesUrl}/download/${version}/perehliadach-${version}-x86_64-setup.signature.txt`
      url: `${releasesUrl}/download/${version}/perehliadach-${version}-x86_64-setup.zip`,
    },
  },
};

fs.writeFileSync(
  latestVersionFile, 
  JSON.stringify(release, null, 2), 
  'utf8'
);
