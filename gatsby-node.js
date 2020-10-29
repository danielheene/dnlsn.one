// const path = require('path');
// const fs = require('fs');
const { spawnSync } = require('child_process');
const { existsSync } = require('fs');
const { resolve } = require('path');

exports.onPreBootstrap = async () => {
  /**
   * Spawn CLI
   * @type {SpawnSyncReturns<Buffer>}
   */
  const child = spawnSync(process.argv[0], ['cli/index.js'], {
    stdio: [process.stdin, process.stdout, process.stderr],
    shell: true,
  });

  console.log(child);

  //
  const configPath = resolve(__dirname, 'config.json');
  const configExists = existsSync(configPath);

  const test = async () => {
    console.log('STARTING!');
    await new Promise((resolve) => setTimeout(resolve, 30000));
    console.log('READY!');
    return null;
  };

  if (configExists) {
    console.info('INFO: CONFIG EXISTS');
    console.info('INFO: CHECKING CONFIG');
    await test();
    console.info('INFO: READY WITH CORRECT CONFIG');
  } else {
    console.error('ERROR: NO CONFIG');
    console.info('INFO: RUNNING CONFIG CREATION');
    await test();
    console.info('INFO: CONFIG CREATED');
  }

  // help.stopServer();
};
