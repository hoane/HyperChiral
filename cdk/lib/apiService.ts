import { Construct } from "@aws-cdk/core"
import { Code, Function, Runtime } from "@aws-cdk/aws-lambda"
import * as path from "path"

export interface HyperChiralApiServiceProps {

}

export class HyperChiralApiService extends Construct {
    readonly lambda: Function
    constructor(scope: Construct, id: string, props: HyperChiralApiServiceProps) {
        super(scope, id)

        this.lambda = new Function(this, 'Handler', {
            code: Code.fromAsset(path.join(__dirname, '../../api-service/built')),
            runtime: Runtime.NODEJS_12_X,
            handler: 'app.lambdaHandler',
        })
    }
}