import boto3
import json

# Intialize the SNS client
sns = boto3.client('sns')

# Initialize the SNS topic ARN
sns_topic_arn_email = 'arn:aws:sns:us-east-1:818286248176:CSCI5410_Partc_SNS'

# Initialize the SQS URL
QUEUE_URL = 'https://sqs.us-east-1.amazonaws.com/818286248176/CSCI5410_PArtC_SNS1'

# This function is used to get the message from the queue
def lambda_handler(event, context):
    try:
        sqs = boto3.client('sqs')
        
        car_message = sqs.receive_message(
            QueueUrl=QUEUE_URL,
            MaxNumberOfMessages=1,
            VisibilityTimeout=5,
            WaitTimeSeconds=5
        )

        # Extract the order details from the message and publish it in SNS 
        if 'Messages' in car_message:
            sqs_message = car_message['Messages'][0]
            message_body = json.loads(sqs_message['Body'])
            message = json.loads(message_body['Message'])
            
            car_type = message['car_type']
            car_accessories = message['car_accessories']
            street_address = message['street_address']
            
            sns_message = f"Order Details:\nCar Type: {car_type}\nCar Accessories: {car_accessories}\nStreet Address: {street_address}"

            # Publish the Order details  
            sns.publish(
                TopicArn=sns_topic_arn_email,
                Message=sns_message,
                Subject='New Car Delivery Order',
            )
            
            receipt_handle_car = sqs_message['ReceiptHandle']
            
            sqs.delete_message(
                QueueUrl=QUEUE_URL,
                ReceiptHandle=receipt_handle_car
            )
            
            print("Successfully processed the message.")
        else:
            print("No messages in the SQS queue.")
    
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        raise  
        
    return {
        'statusCode': 200,
        'body': 'Processing complete'
    }


# References:
# [1] “Building Lambda functions with Python - AWS Lambda,” docs.aws.amazon.com. 
# [Online]. Available:  https://docs.aws.amazon.com/lambda/latest/dg/lambda-python.html. [Accessed: 23 July 2023].
# [2] “Sample function code - AWS Lambda,” Amazon.com, 2023. 
# [Online]. Available:https://docs.aws.amazon.com/lambda/latest/dg/with-sns-create-package.html. [Accessed: 23 July 2023].
# [3] “Sample Amazon SQS function code - AWS Lambda,” Amazon.com, 2023. 
# [Online].Available: https://docs.aws.amazon.com/lambda/latest/dg/with-sqs-create-package.html#with-sqs-example-deployment-pkg-python. [Accessed: 23 July 2023].



