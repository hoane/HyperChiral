import AWS from "aws-sdk";

AWS.config.region = "us-west-2";

const COGNITO_IDENTITY_POOL_ID =
  "us-west-2:81923733-5747-436e-b266-024dc96b8584";
const cognito = new AWS.CognitoIdentity();

export function setCognitoId(id: string) {
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: COGNITO_IDENTITY_POOL_ID,
    IdentityId: id
  });
}

export async function getCognitoId(): Promise<string> {
  const response = await cognito
    .getId({ IdentityPoolId: COGNITO_IDENTITY_POOL_ID })
    .promise();
  const id = response.IdentityId;
  if (id === undefined) throw new Error("");
  return id;
}
