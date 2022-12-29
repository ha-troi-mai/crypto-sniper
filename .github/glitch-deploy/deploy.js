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


const listProject = `https://57a3a3a8-9d89-4655-9301-351d9a2a9e6c@api.glitch.com/git/chestnut-iron-peacock|https://57a3a3a8-9d89-4655-9301-351d9a2a9e6c@api.glitch.com/git/twisty-erratic-puma|https://57a3a3a8-9d89-4655-9301-351d9a2a9e6c@api.glitch.com/git/shell-rainy-kettledrum|https://57a3a3a8-9d89-4655-9301-351d9a2a9e6c@api.glitch.com/git/elegant-quickest-soarer|https://57a3a3a8-9d89-4655-9301-351d9a2a9e6c@api.glitch.com/git/ginger-brawny-avatar|https://57a3a3a8-9d89-4655-9301-351d9a2a9e6c@api.glitch.com/git/purrfect-zesty-delphinium|https://57a3a3a8-9d89-4655-9301-351d9a2a9e6c@api.glitch.com/git/pickled-lowly-kettledrum|https://57a3a3a8-9d89-4655-9301-351d9a2a9e6c@api.glitch.com/git/cut-harsh-viscose|https://57a3a3a8-9d89-4655-9301-351d9a2a9e6c@api.glitch.com/git/important-meowing-guardian|https://57a3a3a8-9d89-4655-9301-351d9a2a9e6c@api.glitch.com/git/jungle-tundra-neighborhood|https://57a3a3a8-9d89-4655-9301-351d9a2a9e6c@api.glitch.com/git/immense-nosy-agreement|https://57a3a3a8-9d89-4655-9301-351d9a2a9e6c@api.glitch.com/git/steadfast-winter-coaster|https://57a3a3a8-9d89-4655-9301-351d9a2a9e6c@api.glitch.com/git/southern-shore-camelotia|https://57a3a3a8-9d89-4655-9301-351d9a2a9e6c@api.glitch.com/git/daffy-delightful-polyanthus`.trim().split('|');

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