const dotenv = require('dotenv');
dotenv.config({ path: '.env' });

const { S3Client } = require('@aws-sdk/client-s3');

const s3ClientConfig = {
    region: process.env.AWS_S3_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
};

const s3Client = new S3Client(s3ClientConfig);

module.exports ={s3Client};
