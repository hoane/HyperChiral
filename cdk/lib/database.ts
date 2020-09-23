import { Construct, RemovalPolicy } from "@aws-cdk/core";
import { Function } from "@aws-cdk/aws-lambda";
import { AttributeType, BillingMode, Table } from "@aws-cdk/aws-dynamodb";

export interface HyperChiralDatabaseProps {
    lambda: Function
}

export class HyperChiralDatabase extends Construct {
    readonly gameRoomTable: Table
    readonly gameInstanceTable: Table

    constructor(scope: Construct, id: string, props: HyperChiralDatabaseProps) {
        super(scope, id)

        this.gameRoomTable = new Table(this, 'GameRoomTable', {
            partitionKey: {
                name: 'roomCode',
                type: AttributeType.STRING
            },
            removalPolicy: RemovalPolicy.DESTROY,
            billingMode: BillingMode.PAY_PER_REQUEST
        })

        this.gameInstanceTable = new Table(this, 'GameInstanceTable', {
            partitionKey: {
                name: 'id',
                type: AttributeType.STRING
            },
            removalPolicy: RemovalPolicy.DESTROY,
            billingMode: BillingMode.PAY_PER_REQUEST
        })

        this.gameRoomTable.grantReadWriteData(props.lambda)
        this.gameInstanceTable.grantReadWriteData(props.lambda)
    }
}