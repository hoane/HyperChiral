import { Construct } from "@aws-cdk/core";
import {ARecord, HostedZone, RecordTarget} from "@aws-cdk/aws-route53";
import {CloudFrontTarget} from "@aws-cdk/aws-route53-targets";
import {CloudFrontWebDistribution} from "@aws-cdk/aws-cloudfront";

interface HyperChiralRoute53Props {
    distribution: CloudFrontWebDistribution
}

export class HyperChiralRoute53 extends Construct {
    constructor(scope: Construct, id: string, props: HyperChiralRoute53Props) {
        super(scope, id);

        const zone = HostedZone.fromHostedZoneAttributes(this, 'MyZone', {
            zoneName: 'hyperchiral.com',
            hostedZoneId: 'Z0545965193EHW360PQ83'
        });

        const record = new ARecord(this, 'ARecord', {
            zone: zone,
            recordName: 'hyperchiral.com',
            target: RecordTarget.fromAlias(new CloudFrontTarget(props.distribution))
        });
        const wwwRecord = new ARecord(this, 'ARecordWWW', {
            zone: zone,
            recordName: 'www.hyperchiral.com',
            target: RecordTarget.fromAlias(new CloudFrontTarget(props.distribution))
        });
    }
}