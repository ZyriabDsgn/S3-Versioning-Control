export default {
      query: `
        mutation ControlVersions($bucketName: String!, $fileName: String!, $maxVersionsNumber: Number!) {
          controlVersions(bucketName: $bucketName, fileName: $fileName, maxVersionsNumber: $maxVersionsNumber) {
            ... on VersionControlSuccess {
              message
            }
            ... on ServerError {
              message
            }
            ... on StorageNotFound {
              message
            }
            ... on Unauthenticated {
              message
            }
          }
        }
      `,
      variables: {
        bucketName: '',
        fileName: '',
        maxVersionsNumber: 0,
      },
    };