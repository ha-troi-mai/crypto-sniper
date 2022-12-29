const upload_Md = require('./git-push.js');
const createNew_Md = require('./newCreate.js')
const shell = require('shelljs')
const queryString = require('query-string');
const axios = require("axios").default;
const axiosRetry = require('axios-retry');

setTimeout(() => {
  console.log('force exit');
  process.exit(0)
}, 30 * 60 * 1000);

axiosRetry(axios, {
  retries: 100,
  retryDelay: (retryCount) => {
    // console.log(`retry attempt: ${retryCount}`);
    return 3000 || retryCount * 1000;
  },
  retryCondition: (error) => {
    return error.response.status === 502;
  },
});


const listProject = `https://19429f36-7a25-40d6-bb30-0028785d7331@api.glitch.com/git/helix-spiffy-toucan|https://19429f36-7a25-40d6-bb30-0028785d7331@api.glitch.com/git/stealth-berry-wholesaler|https://19429f36-7a25-40d6-bb30-0028785d7331@api.glitch.com/git/fierce-universal-warbler|https://19429f36-7a25-40d6-bb30-0028785d7331@api.glitch.com/git/sweet-locrian-boron|https://19429f36-7a25-40d6-bb30-0028785d7331@api.glitch.com/git/nebulous-momentous-thumb|https://19429f36-7a25-40d6-bb30-0028785d7331@api.glitch.com/git/polite-aged-relation|https://19429f36-7a25-40d6-bb30-0028785d7331@api.glitch.com/git/alpine-parallel-bat|https://19429f36-7a25-40d6-bb30-0028785d7331@api.glitch.com/git/cyan-forested-oatmeal|https://19429f36-7a25-40d6-bb30-0028785d7331@api.glitch.com/git/conscious-separate-quarter|https://19429f36-7a25-40d6-bb30-0028785d7331@api.glitch.com/git/expensive-time-cardigan|https://19429f36-7a25-40d6-bb30-0028785d7331@api.glitch.com/git/cooked-real-octave|https://19429f36-7a25-40d6-bb30-0028785d7331@api.glitch.com/git/chain-mangrove-hockey|https://19429f36-7a25-40d6-bb30-0028785d7331@api.glitch.com/git/numerous-fish-fireman|https://19429f36-7a25-40d6-bb30-0028785d7331@api.glitch.com/git/morning-agate-leek`.trim().split('|');

const delay = t => {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve(true);
    }, t);
  });
};

(async () => {
  try {
    let accountNumber = 0;

    for (let i = 0; i < listProject.length; i++) {
      accountNumber = i + 1;
      try {
        const nameProject = listProject[i].split('/')[4]
        console.log('deploy', nameProject);
        createNew_Md.run(nameProject)
        await upload_Md.upload2Git(listProject[i].trim(), 'code4Delpoy');
        console.log(`account ${accountNumber} upload success ^_^`);

        axios
          .get(`https://eager-profuse-python.glitch.me/deploy?${queryString.stringify({
            email: listProject[i].trim() + ' true'
          })}`)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            if (error.response) {
              console.log(error.response.data);
            } else {
              console.log('Loi');
            }
          });

        if (i + 1 < listProject.length) await delay(1.8 * 60 * 1000);
      } catch (error) {
        console.log(`account ${accountNumber} upload fail ^_^`);
        axios
          .get(`https://eager-profuse-python.glitch.me/deploy?${queryString.stringify({
            email: listProject[i].trim() + ' false'
          })}`)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            if (error.response) {
              console.log(error.response.data);
            } else {
              console.log('Loi');
            }
          });
      }

      if (process.cwd().includes('code4Delpoy')) shell.cd('../', { silent: true });

    }

    await delay(20000)
    console.log('Done! exit')
    process.exit(0)

  } catch (err) {
    console.log(`error: ${err}`);
  }
})();