import { Construct } from '@aws-cdk/core'
import {
	CfnIdentityPool,
	CfnIdentityPoolRoleAttachment
} from '@aws-cdk/aws-cognito'
import {
	Effect,
	FederatedPrincipal,
	PolicyStatement,
	Role
} from '@aws-cdk/aws-iam'

export interface HyperChiralAuthConstructProps { }

export class HyperChiralAuthConstruct extends Construct {
    readonly unauthenticatedRole: Role

	constructor(scope: Construct, id: string, props: HyperChiralAuthConstructProps) {
		super(scope, id)

		const identityPool = new CfnIdentityPool(this, 'IdentityPool', {
			allowUnauthenticatedIdentities: true
		})

		this.unauthenticatedRole = new Role(this, 'CognitoUnauthenticatedRole', {
			assumedBy: new FederatedPrincipal(
				'cognito-identity.amazonaws.com',
				{
					"StringEquals": { "cognito-identity.amazonaws.com:aud": identityPool.ref },
					"ForAnyValue:StringLike": { "cognito-identity.amazonaws.com:amr": "unauthenticated" },
				},
				"sts:AssumeRoleWithWebIdentity"),
		})
		this.unauthenticatedRole.addToPolicy(new PolicyStatement({
			effect: Effect.ALLOW,
			actions: [
				"mobileanalytics:PutEvents",
				"cognito-sync:*"
			],
			resources: ["*"],
		}))

		const defaultPolicy = new CfnIdentityPoolRoleAttachment(this, 'DefaultValid', {
			identityPoolId: identityPool.ref,
			roles: {
				'unauthenticated': this.unauthenticatedRole.roleArn
			}
		})
	}
}
