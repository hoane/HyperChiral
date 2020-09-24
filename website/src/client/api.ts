import AWS, { CognitoIdentity, Credentials } from 'aws-sdk'
import { NormalizedCacheObject } from 'apollo-cache-inmemory'
import AWSAppSyncClient, { AUTH_TYPE } from 'aws-appsync'
import Cookies from 'js-cookie'
import * as Model from 'hyper-chiral-model'
import { DocumentNode } from "apollo-link";
const region = 'us-west-2'
AWS.config.region = region
const GRAPHQL_ENDPOINT =
    'https://lggrrow745b5nlbvrvk3574plm.appsync-api.us-west-2.amazonaws.com/graphql'
const COGNITO_IDENTITY_POOL_ID =
    'us-west-2:3fbc638f-acb5-4be1-be12-837c86755352'
const COGNITO_ID_COOKIE = 'CognitoId'

async function getNewCognitoId(cognito: CognitoIdentity): Promise<string> {
    const response = await cognito
        .getId({ IdentityPoolId: COGNITO_IDENTITY_POOL_ID })
        .promise()
    const id = response.IdentityId
    if (id === undefined) throw new Error('')
    return id
}

async function getCognitoId(cognito: CognitoIdentity): Promise<string> {
    const cookie = Cookies.get(COGNITO_ID_COOKIE)
    if (cookie === undefined) {
        const id = await getNewCognitoId(cognito)
        Cookies.set(COGNITO_ID_COOKIE, id, { expires: 1 })
        return id
    } else {
        return cookie
    }
}

async function getCognitoCredentials(
    cognito: CognitoIdentity,
    id: string
): Promise<Credentials> {
    console.log('GETTING CREDS')
    const response = await cognito
        .getCredentialsForIdentity({
            IdentityId: id
        })
        .promise()
    if (response.Credentials === undefined) throw new Error('No Creds')
    return new Credentials(
        response.Credentials.AccessKeyId ?? '',
        response.Credentials.SecretKey ?? '',
        response.Credentials.SessionToken ?? ''
    )
}

async function getAppSyncClient(cognito: CognitoIdentity, id: string) {
    const client = new AWSAppSyncClient({
        url: GRAPHQL_ENDPOINT,
        region: region,
        auth: {
            type: AUTH_TYPE.AWS_IAM,
            credentials: () => getCognitoCredentials(cognito, id)
        }
    })

    return await client.hydrated()
}

export class ApiClient {
    static _instance: ApiClient | null = null

    static get instance(): ApiClient {
        if (ApiClient._instance === null)
            throw new Error('initialization error')
        return ApiClient._instance
    }

    appsync: AWSAppSyncClient<NormalizedCacheObject>
    cognito: CognitoIdentity
    cognitoId: string

    constructor(
        appsync: AWSAppSyncClient<NormalizedCacheObject>,
        cognito: CognitoIdentity,
        cognitoId: string
    ) {
        this.appsync = appsync
        this.cognito = cognito
        this.cognitoId = cognitoId
    }

    async gQuery(query: DocumentNode, item: any): Promise<any> {
        const data = await this.appsync.query({
            query: query,
            variables: item
        })

        return data.data
    }

    async gameRoom(
        input: Model.GameRoomQueryVariables
    ): Promise<Model.GameRoomQuery> {
        return await this.gQuery(Model.GameRoomDocument, input)
    }
}

export async function initialize() {
    const cognito = new CognitoIdentity()
    const cognitoId = await getCognitoId(cognito)
    const appsync = await getAppSyncClient(cognito, cognitoId)
    ApiClient._instance = new ApiClient(appsync, cognito, cognitoId)
}
