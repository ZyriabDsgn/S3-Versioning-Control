import { ListObjectVersionsCommand, ObjectVersion } from '@aws-sdk/client-s3';
import normalize from 'normalize-path';
import getFileExtension from '../tools/getFileExtension.utils';
import isBucketVersioned from './isBucketVersioned';
import s3Client from './s3Client';

interface InputArgs {
  bucketName: string;
}

export default async function listBucketContent(args: InputArgs) {
  try {
    const isVersioned = await isBucketVersioned(args.bucketName);
    const params = {
      Bucket: args.bucketName,
      Prefix: '',
    };

    const res = await s3Client().send(new ListObjectVersionsCommand(params));

    const status = res?.$metadata.httpStatusCode || 500;

    if (status >= 200 && status <= 299) {
      const files =
        res.Versions?.filter(
          (v: ObjectVersion) => v.Key && getFileExtension(v.Key)
        ) || [];

      const versions = files.filter((f: ObjectVersion) => !f.IsLatest);

      const fileList = files!
        .filter((f: ObjectVersion) => f.IsLatest)
        .map((f) => {
          const filePath = `${f.Key!.slice(0, f.Key!.lastIndexOf('/'))}/`;

          return {
            id: f.VersionId,
            name: f.Key!.replace(filePath, ''),
            lastModified: f.LastModified!.toISOString(),
            size: f.Size!,
            path: filePath,
            versions: [] as any[],
          };
        });

      if (isVersioned)
        for (const f of fileList) {
          f.versions = versions!
            .filter((v) => normalize(v.Key!).split('/').pop() === f.name)
            .map(
              (v) =>
                ({
                  id: v.VersionId,
                  name: normalize(v.Key!).split('/').pop(),
                  lastModified: v.LastModified!.toISOString(),
                  size: v.Size,
                  path: v.Key!.replace(normalize(v.Key!).split('/').pop()!, ''),
                } as any)
            );
        }

      return [undefined, fileList];
    }

    throw new Error(`Could not get contents: ${status}`);
  } catch (err) {
    return [err as Error];
  }
}
