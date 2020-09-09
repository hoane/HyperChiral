import {
	Construct,
	Stack,
	StackProps
} from '@aws-cdk/core'
import { HyperChiralAuthConstruct, HyperChiralAuthConstructProps } from './auth'
import { HyperChiralWebsiteConstruct, HyperChiralWebsiteConstructProps } from './website'

export class HyperChiralCdkStack extends Stack {
	constructor(scope: Construct, id: string, props?: StackProps) {
		super(scope, id, props)

		const auth = new HyperChiralAuthConstruct(this, 'Auth', {})
		const website = new HyperChiralWebsiteConstruct(this, 'Website', {})
	}
}
