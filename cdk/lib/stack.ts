import {
	Construct,
	Stack,
	StackProps,
	Tags
} from '@aws-cdk/core'
import { HyperChiralAuthConstruct, HyperChiralAuthConstructProps } from './auth'
import { HyperChiralWebsiteConstruct, HyperChiralWebsiteConstructProps } from './website'
import { HyperChiralAppSync, HyperChiralAppSyncProps } from './appsync'
import {HyperChiralApiService} from "./apiService";
import {HyperChiralDatabase} from "./database";
import {HyperChiralRoute53} from "./route53";

export class HyperChiralCdkStack extends Stack {
	constructor(scope: Construct, id: string, props?: StackProps) {
		super(scope, id, props)

		const auth = new HyperChiralAuthConstruct(this, 'Auth', {})
		const website = new HyperChiralWebsiteConstruct(this, 'Website', {})
		const route53 = new HyperChiralRoute53(this, 'Route53', { distribution: website.distribution })
		const apiService = new HyperChiralApiService(this, 'ApiService', {})
		const database = new HyperChiralDatabase(this, 'Database', { lambda: apiService.lambda })
        const api = new HyperChiralAppSync(this, 'AppSync', {
            appRole: auth.unauthenticatedRole,
			apiService,
			database
        })

        Tags.of(this).add("project", "HyperChiral")
	}
}
