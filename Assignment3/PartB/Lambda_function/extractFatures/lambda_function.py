import boto3
import json
import re

def lambda_handler(event, context):
    
    # get the bucket name from event test input
    bucket_name = event['Records'][0]['s3']['bucket']['name']
    
    object_list = get_object_list(bucket_name)
    
    for file_info in object_list:
        file_key = file_info['Key']
        
        # This method is used to create S3 client 
        s3_client = boto3.client('s3')
        
        # It will get the content from file of S3 bucket
        response = s3_client.get_object(Bucket=bucket_name, Key=file_key)
        file_content = response['Body'].read().decode('utf-8')
        
        # This mehtod is used to extract name entities from the file
        named_entities = extract_named_entities(file_content)
        
        # It will create json object of the extarcted entities
        json_object = {file_key + 'ne': named_entities}
        json_string = json.dumps(json_object)
        
        # It will cretae another file and store the json object in that file 
        new_bucket_name = 'tagsb00930131'
        new_file_key = file_key[:-4] + 'ne.txt'
        
        # This method will upload the newly created file to bucket named tagsb00930131
        s3_client.put_object(Body=json_string, Bucket=new_bucket_name, Key=new_file_key)
    
    return {
        'statusCode': 200,
        'body': 'Named entities extracted and saved as JSON files for all files in the bucket.'
    }

def get_object_list(bucket_name):
    
    s3_client = boto3.client('s3')
    
    response = s3_client.list_objects_v2(Bucket=bucket_name)
    object_list = response['Contents'] if 'Contents' in response else []
    return object_list

# This method is used to extract name entities from the file 
def extract_named_entities(file_content):
    
    words = re.findall(r'\b[A-Z][a-zA-Z]*\b', file_content)
    
    named_entities = {}
    for word in words:
        named_entities[word] = named_entities.get(word, 0) + 1
    
    return named_entities

# References:

# [1] “Building Lambda functions with Python - AWS Lambda,” docs.aws.amazon.com. 
# [Online]. Available:  https://docs.aws.amazon.com/lambda/latest/dg/lambda-python.html. [Accessed: 23 July 2023].
# [2] “Work with Amazon S3 - AWS SDK for Java 2.x,” docs.aws.amazon.com. 
# [Online]. Available:   https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/examples-s3.html. [Accessed: 23 July 2023].
