export default function getBucketInfo(event: any) {
  let maxVersionsNumber;

  const bucketName = event.Records[0].s3.bucket.name;
  const fileName = decodeURIComponent(
    event.Records[0].s3.object.key.replace(/\+/g, ' ')
  );

  switch (bucketName) {
    case 'metaoist-test-bucket-app':
      maxVersionsNumber = 3;
      break;
    default:
      maxVersionsNumber = 2;
      break;
  }

  return [bucketName, fileName, maxVersionsNumber];
}
