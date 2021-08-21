const admin = require('firebase-admin');
require('dotenv').config();

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.SECRET)),
  storageBucket: process.env.BUCKET,
});

const main = async () => {
  const bucket = await admin.storage().bucket();
  const data = await bucket.getFiles();

  console.log(`全ファイル数: ${data[0].length}`);

  for (let m of data[0]) {
    const now = new Date().getTime();
    const timeCreated = new Date(m.metadata.timeCreated);

    if ((now - timeCreated) / 1000 > Number(process.env.DEADLINE)) {
      await bucket.file(m.metadata.name).delete();
    }

    console.log(m.metadata.name);
  }
};

main();
