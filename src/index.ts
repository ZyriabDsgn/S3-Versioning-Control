/* eslint-disable no-console */
/* eslint-disable import/no-import-module-exports */
import getBucketInfo from './utils/getBucketInfo.utils';
import controlVersions from './utils/s3/controlVersions';
import 'dotenv/config';

require('source-map-support').install();

exports.handler = async (event: any) => {
  try {
    const [bucketName, fileName, maxVersionsNumber] = getBucketInfo(event);
    const [error, hasDeleted] = await controlVersions({
      bucketName,
      fileName,
      maxVersionsNumber,
    });

    if (error) throw error;

    if (hasDeleted) console.log('File succesfully deleted');
  } catch (err) {
    console.error(err);
  }
};
