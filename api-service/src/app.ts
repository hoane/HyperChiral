import { 
  APIGatewayProxyResult,
  Context
} from "aws-lambda";
export const lambdaHandler = async (
  event: any,
  context: Context
): Promise<APIGatewayProxyResult> => {
  const out = JSON.stringify(event);
  return {
    statusCode: 200,
    body: out
  }
}
