#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { HyperChiralCdkStack } from '../lib/hyper_chiral_cdk-stack';

const app = new cdk.App();
new HyperChiralCdkStack(app, 'HyperChiralCdkStack');
