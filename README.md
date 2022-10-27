# S3-Versioning-Control

Webhook-Lambda to control S3 objects' versions number with Buckaroo

## Installation

### Lambda function creation
1. Go to the AWS console and log in.
2. Go the the Identity Access Management (IAM)
   - On the left menu, click "Users"
   - Click "Add users"
     - User name: Whatever you want (i.e.: "S3-versioning-controller")
     - Check: `Access key - Programmatic access`
     - Click "Next: Permissions"
     - Select "Attach existing policies directly"
     - For the sake of simplicity, select `AmazonS3FullAccess` (**note**: It is recommended that you create a new policy, giving the minimum permissions required).
     - Click "Next" twice, review the user you created
     - Click "Create user"
     - Copy and keep in a text file the "Access key ID" and "Secret access key" (**keep the later absolutely secret, don't put it on a github repo or anything!**)
3. Go to the Lambda functions console and create a new function.
4. Set the following settings:
   - Function name: `webhook-s3-versioning-control-[development/staging/production]` (you can call it whatever you want, but the workflows are set up for these names - depending on the git branch -, if you decide to go this route).
   - Runtime: Node.js
   - Architecture: x86_64
5. On top of the window, click "Add trigger"
   - Source: S3
   - Bucket: Your bucket
   - Event type: "POST"
   - Check the box (**read the message first!**)
   - Do the following for each bucket you need want to control (we'll add custom config for each buckets later on - Check the "Usage" section)
6. In the "Environment variables" menu section (on the left):
   - Click "Edit" then "Add environment variable"
   - Add the following:
     - Key: `NODE_ENV`
     - Value: development/staging/production
     - Key: `S3_ACCESS_KEY_ID`
     - Value: The access key ID from earlier
     - Key: `S3_SECRET_ACCESS_KEY`
     - Value: The secret access key from earlier

### API directory

These are the steps to automatically bundle the API's code in one big JS file and deploy it manually on Lambda. You can also use AWS CLI or automate the deployment when you push your code on your GitHub repo, by using the included action `deploy-development.yml` (and modify it for staging/production) but that's outside the scope of this readme, feel free to do some research about it (most of the work is already done).

1. In your terminal, go the project's directory.
2. Run the command `npm i` in order to install all the project's dependencies.
3. Run `npm run build`.
4. Move the file `index.js` from the newly created `dist/` folder to the root folder of the project.
5. Select the file `index.js` and compress it into a .zip file.
6. Go back to the AWS Lambda function dashboard.
7. In the "Code" tab (top-right of the editor), select "Upload from > .zip file" and upload the .zip file.

## Usage

### Configuration

Add the name of your bucket and the desired versions number cap in `src/utils/getBucketInfo.utils.ts`;

Example:

```ts
if (bucketName.includes('myBucket')) {
  maxVersionsNumber = 5;
}
```

From now on it will work by itself, checking the POSTed object everytime it's done.

## Contributing

Feel free to send a PR, this is a small side project and if you spot any error in the code or README, I would appreciate your help 🙂

## License

This software is under the [MIT](https://choosealicense.com/licenses/mit/) license, a short and simple permissive license with conditions only requiring preservation of copyright and license notices. Licensed works, modifications, and larger works may be distributed under different terms and without source code. (Do whatever you want with it 🤙).
