import { CognitoIdentity } from 'aws-sdk'
import { NormalizedCacheObject } from 'apollo-cache-inmemory'
import AWSAppSyncClient from 'aws-appsync'
import { DocumentNode } from 'apollo-link'
import * as Model from 'hyper-chiral-model'

export class ApiClient {

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

    async query(query: DocumentNode, item: any): Promise<any> {
        const data = await this.appsync.query({
            query: query,
            variables: item
        })
        return data.data
    }

    async mutate(mutation: DocumentNode, item: any): Promise<any> {
        const data = await this.appsync.mutate({
            mutation: mutation,
            variables: item
        })
        return data.data
    }

    async gameRoom(
        input: Model.GameRoomQueryVariables
    ): Promise<Model.GameRoomQuery> {
        return await this.query(Model.GameRoomDocument, input)
    }

    async gameInstance(
        input: Model.GameInstanceQueryVariables
    ): Promise<Model.GameInstanceQuery> {
        return await this.query(Model.GameInstanceDocument, input)
    }

    async startGame(
        input: Model.StartGameMutationVariables
    ): Promise<Model.StartGameMutation> {
        return await this.mutate(Model.StartGameDocument, input)
    }
}
