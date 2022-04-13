/* eslint-disable no-console */
/* eslint-disable import/no-import-module-exports */
import fetch from 'cross-fetch'
import query from './utils/helpers/controlVersionsQuery.helper';
import getAccessToken from './utils/auth-caching/getAccessToken';
import getBucketInfo from './utils/getBucketInfo.utils';
import 'dotenv/config';

exports.handler = async (event: any) => {
  try {
    const controlApiUrl = process.env.CONTROL_API_URL!;
   
    const [bucketName, fileName, maxVersionsNumber] = getBucketInfo(event);

    const [error, token] = await getAccessToken();

    if(error) throw error;

    query.variables.bucketName = bucketName;
    query.variables.fileName = fileName;
    query.variables.maxVersionsNumber = maxVersionsNumber;

    const res = await fetch(controlApiUrl, {
      method: 'POST',
      body: JSON.stringify(query),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status !== 200 && res.status !== 201) {
      console.error(res.status.toString());
    }

    const resData = await res.json();

    console.log(resData.data.controlVersions.message);
  } catch (err) {
    console.error(err);
  }
};
