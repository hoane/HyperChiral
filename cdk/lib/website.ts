import {Construct} from '@aws-cdk/core'
import {Bucket} from '@aws-cdk/aws-s3'
import {BucketDeployment, Source} from '@aws-cdk/aws-s3-deployment'
import {
	CloudFrontAllowedMethods,
	CloudFrontWebDistribution,
	ViewerCertificate,
	ViewerProtocolPolicy
} from "@aws-cdk/aws-cloudfront"
import {Certificate} from "@aws-cdk/aws-certificatemanager";

export interface HyperChiralWebsiteConstructProps {
}

export class HyperChiralWebsiteConstruct extends Construct {
	readonly distribution: CloudFrontWebDistribution
	constructor(scope: Construct, id: string, props: HyperChiralWebsiteConstructProps) {
		super(scope, id)

		const certArn = "arn:aws:acm:us-east-1:615207140201:certificate/db6f7361-1fcd-48c9-ad86-da8dbed1827d"
		const certificate = Certificate.fromCertificateArn(this, 'Certificate', certArn)

		const websiteBucket = new Bucket(this, 'WebsiteBucket', {
			publicReadAccess: true
		})
		this.distribution = new CloudFrontWebDistribution(this, 'Distribution', {
			originConfigs: [
				{
					s3OriginSource: {
						s3BucketSource: websiteBucket
					},
					behaviors: [
						{
							allowedMethods: CloudFrontAllowedMethods.GET_HEAD,
							isDefaultBehavior: true
						}
					]
				}
			],
			defaultRootObject: "index.html",
			viewerCertificate: ViewerCertificate.fromAcmCertificate(certificate, {
				aliases: ['hyperchiral.com', 'www.hyperchiral.com']
			}),
			viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS
		})

		const websiteDeployment = new BucketDeployment(this, 'DeployWebsite', {
			sources: [ Source.asset('../website/dist') ],
			destinationBucket: websiteBucket
		});
	}
}

