import AWS, { CognitoIdentity, Credentials } from "aws-sdk";
import aws4 from "aws4";
import Amplify from "aws-amplify";
import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import AWSAppSyncClient, { AUTH_TYPE } from "aws-appsync";
import gql from "graphql-tag";
import Cookies from "js-cookie";
import {
  gameInstanceByRoomCode
} from "../graphql/queries";
import * as API from "../API";
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
const COGNITO_ID_COOKIE = "CognitoId";

async function getNewCognitoId(cognito: CognitoIdentity): Promise<string> {
  const response = await cognito
    .getId({ IdentityPoolId: COGNITO_IDENTITY_POOL_ID })
    .promise();
  const id = response.IdentityId;
  if (id === undefined) throw new Error("");
  return id;
}

async function getCognitoId(cognito: CognitoIdentity): Promise<string> {
  const cookie = Cookies.get(COGNITO_ID_COOKIE);
  if (cookie === undefined) {
    const id = await getNewCognitoId(cognito);
    Cookies.set(COGNITO_ID_COOKIE, id, { expired: 1 });
    return id;
  } else {
    return cookie;
  }
}

async function getCognitoCredentials(cognito: CognitoIdentity, id: string): Promise<Credentials> {
  console.log("GETTING CREDS");
  const response = await cognito
    .getCredentialsForIdentity({
      IdentityId: id
    })
    .promise();
  if (response.Credentials === undefined) throw new Error("No Creds");
  return new Credentials(
    response.Credentials.AccessKeyId ?? "",
    response.Credentials.SecretKey ?? "",
    response.Credentials.SessionToken ?? ""
  )
}

async function getAppSyncClient(cognito: CognitoIdentity, id: string) {
  const client = new AWSAppSyncClient({
    url: appSyncConfig.aws_appsync_graphqlEndpoint,
    region: "us-west-2",
    auth: {
      type: AUTH_TYPE.AWS_IAM,
      credentials: () => getCognitoCredentials(cognito, id)
    }
  });

  return await client.hydrated();
}

export class ApiClient {
  static _instance: ApiClient | null = null

  static get instance(): ApiClient {
    if (ApiClient._instance === null) throw new Error("initialization error");
    return ApiClient._instance;
  }

  appsync: AWSAppSyncClient<NormalizedCacheObject>
  cognito: CognitoIdentity
  cognitoId: string

  constructor(appsync: AWSAppSyncClient<NormalizedCacheObject>, cognito: CognitoIdentity, cognitoId: string) {
    this.appsync = appsync;
    this.cognito = cognito;
    this.cognitoId = cognitoId;
  }

  async gQuery(query: string, item: any): Promise<any> {
    const data = await this.appsync.query({
      query: gql(query),
      variables: item
    })

    return data.data;
  }

  async getGameInstanceByRoomCode(input: API.GameInstanceByRoomCodeQueryVariables): Promise<API.GameInstanceByRoomCodeQuery> {
    return await this.gQuery(gameInstanceByRoomCode, input);
  }
}

export async function initialize() {
  const cognito = new CognitoIdentity();
  const cognitoId = await getCognitoId(cognito);
  const appsync = await getAppSyncClient(cognito, cognitoId);
  ApiClient._instance = new ApiClient(appsync, cognito, cognitoId);
}

