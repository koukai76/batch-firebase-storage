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
  data[0].map(m => {
    const now = new Date().getTime();
    const timeCreated = new Date(m.metadata.timeCreated);

    if ((now - timeCreated) / 1000 > Number(process.env.DEADLINE)) {
      bucket.file(m.metadata.name).delete();
    }

    console.log(m.metadata.name);
  });
};

main();
