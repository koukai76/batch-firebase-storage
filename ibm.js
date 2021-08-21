const { exec } = require('child_process');

const func = command => {
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout, stderr) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(stdout);
    });
  });
};

const main = async params => {
  try {
    await func(`mkdir abc && cd abc && git clone ${params.GIT_URL} .`);

    fs.writeFileSync(
      'abc/.env',
      `SECRET=${JSON.stringify(params.SECRET)}\nBUCKET=${
        params.BUCKET
      }\nDEADLINE=${params.DEADLINE}`
    );

    await func(`cd abc && npm i && node app`);

    return { message: 'fin' };
  } catch (e) {
    return { message: 'e' };
  }
};
