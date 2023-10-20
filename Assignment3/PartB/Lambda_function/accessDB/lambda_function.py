import boto3
import json

def lambda_handler(event, context):

    # Get the name of the S3 bucket from the test event data
    bucket_name = event['Records'][0]['s3']['bucket']['name']
    
    object_list = get_object_list(bucket_name)
    
    for file_info in object_list:
        file_key = file_info['Key']
        
        # Initialize Amazon S3 client
        s3_client = boto3.client('s3')
        
        # This is mehtod id used to get the content from the S3 bucket
        response = s3_client.get_object(Bucket=bucket_name, Key=file_key)
        file_content = response['Body'].read().decode('utf-8')
        
        named_entities_json = json.loads(file_content)
        
        # This method is used to update the DynamoDB table
        update_dynamodb(named_entities_json)
    
    return {
        'statusCode': 200,
        'body': 'DynamoDB table updated.'
    }

def get_object_list(bucket_name):

    # Initialize Amazon S3 client
    s3_client = boto3.client('s3')
    
    response = s3_client.list_objects_v2(Bucket=bucket_name)
    
    object_list = response['Contents'] if 'Contents' in response else []
    return object_list

def update_dynamodb(named_entities_json):
    # This method will create DynamoDB resource
    dynamodb = boto3.resource('dynamodb')
    
    #It will get the DynamoDB name from tables of DynamoDB
    table = dynamodb.Table('CSCI5410_Ass3_Part2')
    
    for key, value in named_entities_json.items():
        for entity, entity_value in value.items():
            # IT will chekc that entity is already exist or not
            response = table.get_item(
                Key={
                    'key': entity
                }
            )
            item = response.get('Item')

            # If the entity exists, it will update value
            if item:
                table.update_item(
                    Key={
                        'key': entity
                    },
                    UpdateExpression='SET #val = #val + :inc',
                    ExpressionAttributeNames={
                        '#val': 'value'
                    },
                    ExpressionAttributeValues={
                        ':inc': entity_value
                    }
                )
            # If  entity does not exist, it will  create a new item with its value
            else:
                table.put_item(
                    Item={
                        'key': entity,
                        'value': entity_value
                    }
                )

# References:

# [1] “Building Lambda functions with Python - AWS Lambda,” docs.aws.amazon.com. 
# [Online]. Available:  https://docs.aws.amazon.com/lambda/latest/dg/lambda-python.html. [Accessed: 23 July 2023].

# [2] “Work with DynamoDB - AWS SDK for Java 2.x,” docs.aws.amazon.com. 
# [Online]. Available: https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/examples-dynamodb.html. [Accessed: 23 July 2023].
