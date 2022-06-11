export default function getBucketInfo(event: any): [string, string, number] {
  let maxVersionsNumber = 2;

  const bucketName: string = event.Records[0].s3.bucket.name;
  const fileName = decodeURIComponent(
    event.Records[0].s3.object.key.replace(/\+/g, ' ')
  );

  if (bucketName.includes('shopicsv')) {
    maxVersionsNumber = 3;
  }

  return [bucketName, fileName, maxVersionsNumber];
}
