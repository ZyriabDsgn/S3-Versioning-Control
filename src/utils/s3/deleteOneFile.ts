import {
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import isBucketVersioned from './isBucketVersioned';
import s3Client from './s3Client';

interface InputArgs {
  fileName: string;
  bucketName: string;
  versionId?: string;
}

export default async function deleteOneFile(
  args: InputArgs
): Promise<[undefined, string] | [Error]> {
  try {
    const isVersioned = await isBucketVersioned(args.bucketName);

    const params: any = {
      Bucket: args.bucketName,
      Key: `${args.fileName}`,
      VersionId: isVersioned ? args.versionId : 'null',
    };

    const res = await s3Client().send(new DeleteObjectCommand(params));

    const status = res?.$metadata.httpStatusCode || 500;

    if (status >= 200 && status <= 299) {
      return [undefined, args.fileName];
    }

    throw new Error(
      `Could not finish deletion: ${status}. Some objects may have been deleted.`
    );
  } catch (err) {
    return [err as Error];
  }
}
