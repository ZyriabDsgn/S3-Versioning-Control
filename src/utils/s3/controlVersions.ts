import deleteOneFile from './deleteOneFile';
import listBucketContent from './listBucketContent';

interface InputArgs {
  bucketName: string;
  fileName: string;
  maxVersionsNumber: number;
}

export default async function controlVersions(
  args: InputArgs
): Promise<[undefined, boolean] | [Error]> {
  try {
    const [error, files] = await listBucketContent({
      bucketName: args.bucketName,
    });

    if (error) throw error as Error;

    const fileToUpdate = (<any[]>files!).filter((f) => f.name === args.fileName);

    if (fileToUpdate.length === 0 || fileToUpdate[0].length < args.maxVersionsNumber) {
      return [undefined, false];
    }

    const filesToDelete = await Promise.all(
      fileToUpdate[0].versions!.map((v: any) =>
        deleteOneFile({
          fileName: args.fileName,
          versionId: v.id,
          bucketName: args.bucketName,
        })
      )
    );

    if (filesToDelete.filter(([e]) => e !== undefined).length > 0) {
      for (const [e] of filesToDelete) {
        if (e) throw e;
      }
    }

    return [undefined, true];
  } catch (err) {
    return [err as Error];
  }
}
