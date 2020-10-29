require('ts-node').register({
  project: require('path').resolve(__dirname, '..', 'tsconfig.json'),
});

const { Shell } = require('./Shell');
const { Docs } = require('./Docs');

const block = async () => {
  await new Promise((resolve) => setTimeout(resolve, 300000));
};

(async () => {
  Shell.create();
  // await Docs.create();
  //
  // await block();
})();
