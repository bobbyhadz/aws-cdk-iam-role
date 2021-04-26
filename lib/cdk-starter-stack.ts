import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';

export class CdkStarterStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 👇 Create CloudWatch Logs Permission Policy
    // const cwLogsPolicy = new iam.PolicyDocument({
    //   statements: [
    //     new iam.PolicyStatement({
    //       resources: ['*'],
    //       actions: ['logs:DescribeLogGroups', 'logs:DescribeLogStreams'],
    //     }),
    //   ],
    // });

    // 👇 Create ACM Permission Policy
    const describeAcmCertificates = new iam.PolicyDocument({
      statements: [
        new iam.PolicyStatement({
          resources: ['arn:aws:acm:*:*:certificate/*'],
          actions: ['acm:DescribeCertificate'],
        }),
      ],
    });

    // 👇 Create role1
    const role1 = new iam.Role(this, 'example-iam-role', {
      assumedBy: new iam.ServicePrincipal('apigateway.amazonaws.com'),
      description: 'An example IAM role in AWS CDK',
      // 👇 created with the role, whereas `addToPolicy` ones are added via a separate CloudFormation reosurce ( allows us to avoid circular dependencies )
      inlinePolicies: {
        DescribeACMCerts: describeAcmCertificates,
      },
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          'AmazonAPIGatewayInvokeFullAccess',
        ),
      ],
    });

    // // 👇 add an Inline Policy to role1
    // role1.addToPolicy(
    //   new iam.PolicyStatement({
    //     actions: ['logs:CreateLogGroup', 'logs:CreateLogStream'],
    //     resources: ['*'],
    //   }),
    // );

    // // 👇 add a Managed Policy to role 1
    // role1.addManagedPolicy(
    //   iam.ManagedPolicy.fromAwsManagedPolicyName(
    //     'service-role/AmazonAPIGatewayPushToCloudWatchLogs',
    //   ),
    // );

    // // 👇 attach an Inline Policy to role 1
    // role1.attachInlinePolicy(
    //   new iam.Policy(this, 'cw-logs', {
    //     statements: [
    //       new iam.PolicyStatement({
    //         actions: ['logs:PutLogEvents'],
    //         resources: ['*'],
    //       }),
    //     ],
    //   }),
    // );

    // // 👇 Add the Lambda service as a Principal
    // role1.assumeRolePolicy?.addStatements(
    //   new iam.PolicyStatement({
    //     actions: ['sts:AssumeRole'],
    //     effect: iam.Effect.ALLOW,
    //     principals: [new iam.ServicePrincipal('lambda.amazonaws.com')],
    //   }),
    // );

    // 👇 create Role and attach Managed Policy
    // const role2 = new iam.Role(this, 'cw-logs-2', {
    //   assumedBy: new iam.ServicePrincipal('apigateway.amazonaws.com'),
    //   managedPolicies: [
    //     // 👇 some managed policies have prefixes
    //     iam.ManagedPolicy.fromAwsManagedPolicyName(
    //       'service-role/AmazonAPIGatewayPushToCloudWatchLogs',
    //     ),
    //   ],
    // });

    // const role3 = new iam.Role(this, 'cw-logs-3', {
    //   assumedBy: new iam.ServicePrincipal('apigateway.amazonaws.com'),
    //   inlinePolicies: {
    //     CWLogsPolicy: cwLogsPolicy,
    //     DescribeACMCerts: describeAcmCertificates,
    //   },
    //   managedPolicies: [
    //     iam.ManagedPolicy.fromAwsManagedPolicyName(
    //       'AmazonAPIGatewayInvokeFullAccess',
    //     ),
    //   ],
    // });

    // ❓️ have to prefixed with /service-name??? read docs first

    // const s3CodePolicy = new iam.PolicyDocument({
    //   statements: [
    //     new iam.PolicyStatement({
    //       resources: [`${bucketArn}/${fileKey}`],
    //       actions: ['s3:GetObjectVersion', 's3:GetObject'],
    //     }),
    //   ],
    // });

    // const role = new iam.Role(this, 'AppRole', {
    //   assumedBy: new iam.ServicePrincipal('kinesisanalytics.amazonaws.com'),
    //   inlinePolicies: {
    //     S3Policy: s3CodePolicy,
    //   },
    // });
  }
}
