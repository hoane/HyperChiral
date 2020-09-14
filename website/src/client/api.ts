import AWS from "aws-sdk";
import aws4 from "aws4";
import Amplify, { Auth, API, graphqlOperation } from "aws-amplify";
import AWSAppSyncClient, { AUTH_TYPE } from "aws-appsync";
import {
  gameInstanceByRoomCode
} from "../graphql/queries";
import {
  GameInstanceByRoomCodeQueryVariables
} from "../API";
import https from "https";

const region = "us-west-2";
AWS.config.region = region;
const apiEndpoint = "vpiil6selzewzmn5fwnf7pfyy4.appsync-api.us-west-2.amazonaws.com";
const apiPath = "/graphql";
const appSyncConfig = {
    "aws_project_region": "us-west-2",
    "aws_appsync_graphqlEndpoint": "https://vpiil6selzewzmn5fwnf7pfyy4.appsync-api.us-west-2.amazonaws.com/graphql",
    "aws_appsync_region": "us-west-2",
    "aws_appsync_authenticationType": "AWS_IAM"
}

const COGNITO_IDENTITY_POOL_ID =
  "us-west-2:81923733-5747-436e-b266-024dc96b8584";
const cognito = new AWS.CognitoIdentity();

export function setCognitoId(id: string) {
  console.log("settting creds");
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: COGNITO_IDENTITY_POOL_ID,
    IdentityId: id
  });
  Amplify.configure(appSyncConfig);
}

export async function getCognitoId(): Promise<string> {
  const response = await cognito
    .getId({ IdentityPoolId: COGNITO_IDENTITY_POOL_ID })
    .promise();
  const id = response.IdentityId;
  if (id === undefined) throw new Error("");
  return id;
}

export async function getCognitoCredentials(id: string) {
  const response = await cognito
    .getCredentialsForIdentity({
      IdentityId: id
    })
    .promise();
    /*
  AWS.config.update({
    credentials: new AWS.Credentials(
      response?.Credentials?.AccessKeyId ?? "",
      response?.Credentials?.SecretAccessKey ?? "",
      response?.Credentials?.SessionToken ?? ""
    )
  });
  */
  return response.Credentials;
}

export async function gQuery(query: string, name: string, item: any, creds: any) {
  const body = JSON.stringify({
    query: query,
    variables: item
  });
  console.log(body);

  const opts = {
    host: apiEndpoint,
    path: apiPath,
    region: "us-west-2",
    service: "appsync",
    signQuery: true,
    headers: {
      "Host": apiEndpoint,
      "Content-Type": "application/json"
    },
    body: body
  };

  console.log("send request");
  const data = await new Promise((res, rej) => {
    const httpRequest = https.request(
      aws4.sign(opts, {
        accessKeyId: creds.AccessKeyId,
        secretAccessKey: creds.SecretKey,
        sessionToken: creds.SessionToken 
      }),
      (result) => {
        result.on('data', (data) => {
          res(JSON.parse(data.toString()));
        });
      }
    );
    httpRequest.write(opts.body);
    httpRequest.end();
  });
  console.log(data);

  return data;
}

export async function getGameInstanceByRoomCode(input: GameInstanceByRoomCodeQueryVariables, creds: any) {
  return await gQuery(gameInstanceByRoomCode, "queries/gameInstanceByRoomCode", input, creds);
}
