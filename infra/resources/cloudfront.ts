import {
  Duration,
  aws_cloudfront as cloudfront,
  aws_certificatemanager as certificatemanager,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';

export const createDistribution = ({
  scope,
  id,
  origin,
  certificateArn,
  aliases,
  stackName,
}: {
  scope: Construct;
  id: string;
  certificateArn: string;
  aliases: string[];
  origin: cloudfront.IOrigin;
  stackName: string;
}) => {
  const distribution = new cloudfront.Distribution(
    scope,
    `${id}_Cloudfront`,
    {
      comment: `${stackName} ${id} cache behaviour`,
      defaultBehavior: {
        origin,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
        cachePolicy: new cloudfront.CachePolicy(
          scope,
          `${id}_CachePolicy`,
          {
            defaultTtl: Duration.seconds(10),
            minTtl: Duration.seconds(0),
            maxTtl: Duration.hours(1),
          },
        ),
      },
      domainNames: aliases,
      certificate: certificatemanager.Certificate.fromCertificateArn(
        scope,
        `${id}_CloudFront_CertificateReference`,
        certificateArn,
      ),
    },
  );
  return { distribution };
};

/*
  const distributionOld = new cloudfront.CloudFrontWebDistribution(
    scope,
    `${id}_CloudFront`,
    {
      comment: `${id} uses certificate with arn ${certificateArn}, has aliases [${aliases.join(
        ', ',
      )}]`,
      defaultRootObject: '',
      viewerCertificate: cloudfront.ViewerCertificate.fromAcmCertificate(
        certificatemanager.Certificate.fromCertificateArn(
          scope,
          `${id}_CloudFront_CertificateReference`,
          certificateArn,
        ),
        {
          aliases,
        },
      ),
      originConfigs: [
        {
          customOriginSource: {
            domainName,
            originProtocolPolicy:
              cloudfront.OriginProtocolPolicy.HTTPS_ONLY,
          },
          behaviors: [
            {
              isDefaultBehavior: true,
              allowedMethods: cloudfront.CloudFrontAllowedMethods.ALL,
              forwardedValues: {
                queryString: true,
                cookies: {
                  forward: 'all',
                },
                headers: [
                  'Accept',
                  'Accept-Charset',
                  'Accept-Language',
                  'Accept-Encoding',
                  'Authorization',
                  'Origin',
                  'Referrer',
                  'Access-Control-Request-Method',
                  'Access-Control-Request-Headers',
                ],
              },
              defaultTtl: Duration.seconds(10),
              minTtl: Duration.seconds(0),
              maxTtl: Duration.hours(1),
              functionAssociations: [],
            },
          ],
        },
      ],
    },
  );
*/
