const util = require('util');
const exec = util.promisify(require('child_process').exec);
const log = (string) => console.info(string);

console.clear();

const buildPluginFile = async () => {
  log('Creating build for Plugin...');
  // build property inspector file
  await exec('set ENTRY_FILE=index_plugin.js&& set OUTPUT_FILE=plugin.js&& rescripts build');
  // copy output to build folder
  log('Plugin Build complete, Copying files to installer directory...');
  await exec('cp ./build/plugin.js ./installer/com.xsplit.streamdeck.sdPlugin/plugin.js');
};

const buildPropertyInspectorFile = async () => {
  log('Creating build for PropertyInspector...');
  // build property inspector file
  await exec('set ENTRY_FILE=index_pi.js&& set OUTPUT_FILE=pi.js&& rescripts build');
  // copy output to build folder
  log('PropertyInspector Build complete, Copying files to installer directory...');
  await exec('cp ./build/pi.js ./installer/com.xsplit.streamdeck.sdPlugin/pi.js');
  // copy css to build folder
  await exec('cp ./build/static/css/*.css ./installer/com.xsplit.streamdeck.sdPlugin/css/main.css');
};

const deleteInstaller = async () => {
  log('Deleting existing installer file...');
  return await exec('rm -rf installer/Release/com.xsplit.streamdeck.streamDeckPlugin');
};

const buildInstaller = async () => {
  log('Creating a new Installer file...');
  return await exec(
    'cd ./installer && DistributionTool.exe -b -i com.xsplit.streamdeck.sdPlugin -o Release',
  );
};

const complete = () => log('Installer created!...');

buildPluginFile()
  .then(buildPropertyInspectorFile)
  .then(deleteInstaller)
  .then(buildInstaller)
  .then(complete);
