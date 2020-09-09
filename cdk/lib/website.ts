import {
	Construct,
	Stack
} from '@aws-cdk/core'
import { Bucket } from '@aws-cdk/aws-s3'
import { BucketDeployment, Source } from '@aws-cdk/aws-s3-deployment'

export interface HyperChiralWebsiteConstructProps {
}

export class HyperChiralWebsiteConstruct extends Construct {
	constructor(scope: Construct, id: string, props: HyperChiralWebsiteConstructProps) {
		super(scope, id)
		// Creates a distribution for a S3 bucket.
		const websiteBucket = new Bucket(this, 'WebsiteBucket', {
			bucketName: 'hyperchiral.com',
			websiteIndexDocument: 'index.html',
			publicReadAccess: true
		});

		const redirectBucket = new Bucket(this, 'WWWWebsiteBucket', {
			bucketName: 'www.hyperchiral.com',
			websiteRedirect: { hostName: 'hyperchiral.com' }
		});

		const websiteDeployment = new BucketDeployment(this, 'DeployWebsite', {
			sources: [ Source.asset('../website/dist') ],
			destinationBucket: websiteBucket
		});
	}
}

