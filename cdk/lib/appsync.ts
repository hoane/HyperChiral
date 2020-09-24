import {
    AuthorizationType,
    GraphqlApi,
    IamResource,
    MappingTemplate,
    PrimaryKey,
    Schema,
    Values
} from '@aws-cdk/aws-appsync'
import {
	Role
} from '@aws-cdk/aws-iam'
import {
	Construct,
    RemovalPolicy
} from '@aws-cdk/core'
import { IFunction } from "@aws-cdk/aws-lambda"
import { ITable } from "@aws-cdk/aws-dynamodb";

export interface HyperChiralAppSyncProps {
    appRole: Role
    apiServiceLambda: IFunction
    tables: {
        gameRoom: ITable,
        gameInstance: ITable
    }
}

export class HyperChiralAppSync extends Construct {
    constructor(scope: Construct, id: string, props: HyperChiralAppSyncProps) {
        super(scope, id)

        const api = new GraphqlApi(this, 'GraphqlApi', {
            name: 'HyperChiralGraphqlApi',
            schema: Schema.fromAsset(__dirname + '/schema.graphql'),
            authorizationConfig: {
                defaultAuthorization: {
                    authorizationType: AuthorizationType.IAM
                }
            }
        })

        const gameRoomDS = api.addDynamoDbDataSource('GameRoomDataSource', props.tables.gameRoom)
        gameRoomDS.createResolver({
            typeName: 'Query',
            fieldName: 'gameRoom',
            requestMappingTemplate: MappingTemplate.dynamoDbGetItem('roomCode', 'roomCode'),
            responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
        });

        const gameInstanceDS = api.addDynamoDbDataSource('GameInstanceDataSource', props.tables.gameInstance)
        gameInstanceDS.createResolver({
            typeName: 'Query',
            fieldName: 'gameInstance',
            requestMappingTemplate: MappingTemplate.dynamoDbGetItem('id', 'id'),
            responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
        });

        const apiServiceDS = api.addLambdaDataSource('ApiServiceDataSource', props.apiServiceLambda)
        apiServiceDS.createResolver({
            typeName: 'Mutation',
            fieldName: 'startGame'
        })

        api.grantMutation(props.appRole, 'startGame')
        api.grantQuery(props.appRole, 'gameRoom')
        api.grantQuery(props.appRole, 'gameInstance')
    }
}
