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
    AttributeType,
    BillingMode,
    ProjectionType,
    Table,
} from '@aws-cdk/aws-dynamodb'
import {
	Role
} from '@aws-cdk/aws-iam'
import {
	Construct,
    RemovalPolicy
} from '@aws-cdk/core'

export interface HyperChiralAppSyncProps {
    appRole: Role
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

        const gameTable = new Table(this, 'GameTable', {
            partitionKey: {
                name: 'id',
                type: AttributeType.STRING
            },
            removalPolicy: RemovalPolicy.DESTROY,
            billingMode: BillingMode.PAY_PER_REQUEST
        })
        const gameDS = api.addDynamoDbDataSource('gameDataSource', gameTable)

        gameDS.createResolver({
            typeName: 'Query',
            fieldName: 'game',
            requestMappingTemplate: MappingTemplate.dynamoDbGetItem('id', 'id'),
            responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
        });
        gameDS.createResolver({
            typeName: 'Mutation',
            fieldName: 'addGame',
            requestMappingTemplate: MappingTemplate.dynamoDbPutItem(PrimaryKey.partition('id').auto(), Values.projecting()),
            responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
        });

        const gameInstanceTable = new Table(this, 'GameInstanceTable', {
            partitionKey: {
                name: 'id',
                type: AttributeType.STRING
            },
            removalPolicy: RemovalPolicy.DESTROY,
            billingMode: BillingMode.PAY_PER_REQUEST
        })
        const gameInstanceDS = api.addDynamoDbDataSource('gameInstanceDataSource', gameInstanceTable)

        gameInstanceDS.createResolver({
            typeName: 'Query',
            fieldName: 'gameInstanceByRoomCode',
            requestMappingTemplate: MappingTemplate.fromFile(__dirname + '/resolvers/gameInstanceByRoomCode.vtl'),
            responseMappingTemplate: MappingTemplate.fromFile(__dirname + '/resolvers/gameInstanceByRoomCodeResponse.vtl'),
        });
        gameInstanceDS.createResolver({
            typeName: 'Mutation',
            fieldName: 'addGameInstance',
            requestMappingTemplate: MappingTemplate.dynamoDbPutItem(PrimaryKey.partition('id').auto(), Values.projecting()),
            responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
        });

        const playerTable = new Table(this, 'PlayerTable', {
            partitionKey: {
                name: 'id',
                type: AttributeType.STRING
            },
            removalPolicy: RemovalPolicy.DESTROY,
            billingMode: BillingMode.PAY_PER_REQUEST
        })
        const playerDS = api.addDynamoDbDataSource('playerDataSource', playerTable)
        playerDS.createResolver({
            typeName: 'Query',
            fieldName: 'player',
            requestMappingTemplate: MappingTemplate.dynamoDbGetItem('id', 'id'),
            responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
        });
        playerDS.createResolver({
            typeName: 'Mutation',
            fieldName: 'addPlayer',
            requestMappingTemplate: MappingTemplate.dynamoDbPutItem(PrimaryKey.partition('id').auto(), Values.projecting()),
            responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
        });

        api.grantMutation(props.appRole, 'addGameInstance')
        api.grantMutation(props.appRole, 'addPlayer')
        api.grantQuery(props.appRole, 'gameInstanceByRoomCode')
    }
}
