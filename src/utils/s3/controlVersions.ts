import deleteOneFile from './deleteOneFile';
import listBucketContent from './listBucketContent';

interface InputArgs {
  bucketName: string;
  fileName: string;
  maxVersionsNumber: number;
}

export default async function controlVersions(
  args: InputArgs
): Promise<[undefined, boolean] | [Error, boolean] | [Error]> {
  try {
    // TODO: perhaps replace by HEAD to reduce AWS cost
    const [error, files] = await listBucketContent({
      bucketName: args.bucketName,
    });

    if (error) throw error as Error;

    const fileToUpdate = (<any[]>files!).find((f) => f.name === args.fileName);

    if (
      fileToUpdate == null ||
      fileToUpdate.length < args.maxVersionsNumber
    ) {
      return [undefined, false];
    }

    const filesToDelete = await Promise.all(
      fileToUpdate
        .versions!.sort(
          (a: any, b: any) =>
            new Date(a.lastModified).getTime() -
            new Date(b.lastModified).getTime()
        )
        .slice(args.maxVersionsNumber)
        .map((v: any) =>
          deleteOneFile({
            fileName: args.fileName,
            versionId: v.id,
            bucketName: args.bucketName,
          })
        )
    );

    return [filesToDelete.find(([e]) => e !== undefined)![0], true];
  } catch (err) {
    return [err as Error];
  }
}
