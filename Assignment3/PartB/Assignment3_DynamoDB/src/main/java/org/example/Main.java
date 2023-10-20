package org.example;

import com.amazonaws.AmazonServiceException;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicSessionCredentials;
import com.amazonaws.client.builder.AwsClientBuilder;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.model.*;
import com.amazonaws.services.dynamodbv2.util.TableUtils;

import java.util.List;
import java.util.Scanner;

public final class Main {
    // Add your AWS credentials
    private static final String AWS_ACCESS_KEY = "YOUR AWS ACCESS KEY";
    private static final String AWS_SECRET_KEY = "YOUR AWS SECRET KEY";
    private static final String AWS_SESSION_TOKEN = "YOUR AWS SESSION TOKEN";
    private static final BasicSessionCredentials AWS_CREDENTIALS = new BasicSessionCredentials(AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_SESSION_TOKEN);
    private final AmazonDynamoDB dynamoDBClient;
    private final Regions region = Regions.US_EAST_1;

    // Initialize AWS DynamoDB client
    public Main() {

        dynamoDBClient = createDynamoDBClient();
    }

    public static void main(String[] args) {
        final Scanner sc = new Scanner(System.in);

        // Get the table and primary key attribute from console
        String tableName = null;
        while (tableName == null || tableName.trim().isEmpty()) {
            System.out.println("Enter the name of the DynamoDB table:");
            tableName = sc.nextLine();
        }

        String primaryKey = null;
        while (primaryKey == null || primaryKey.trim().isEmpty()) {
            System.out.println("Enter the primary key attribute name:");
            primaryKey = sc.nextLine();
        }

        final Main m = new Main();
        m.execute(tableName, primaryKey);
    }

    // Initialize Amazon DynamoDB client
    private AmazonDynamoDB createDynamoDBClient() {
        return AmazonDynamoDBClientBuilder.standard().withCredentials(new AWSStaticCredentialsProvider(AWS_CREDENTIALS)).withEndpointConfiguration(new AwsClientBuilder.EndpointConfiguration("dynamodb.us-east-1.amazonaws.com", region.getName())).build();
    }

    // Method createDynamoDBTable is used to create table in Amazon Dynamodb
    private void createDynamoDBTable(String tableName, String primaryKey) {
        try {
            List<AttributeDefinition> attributeDefinitions = List.of(new AttributeDefinition(primaryKey, ScalarAttributeType.S));

            List<KeySchemaElement> keySchema = List.of(new KeySchemaElement(primaryKey, KeyType.HASH));

            ProvisionedThroughput provisionedThroughput = new ProvisionedThroughput(1L, 1L);

            CreateTableRequest createTableRequest = new CreateTableRequest().withTableName(tableName).withAttributeDefinitions(attributeDefinitions).withKeySchema(keySchema).withProvisionedThroughput(provisionedThroughput);

            CreateTableResult createTableResult = dynamoDBClient.createTable(createTableRequest);

            TableUtils.waitUntilActive(dynamoDBClient, tableName);

            System.out.println("DynamoDB table created successfully: " + createTableResult.getTableDescription().getTableName());
        } catch (AmazonServiceException e) {
            e.printStackTrace();
            System.err.println("Error occurred while creating DynamoDB table: " + e.getMessage());
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    public void execute(String tableName, String primaryKey) {
        try {
            createDynamoDBTable(tableName, primaryKey);
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println(e.getMessage());
        }
    }
}
/*
I referred below source to create DynamoDB table using java SDK as I reused my assignment  1 code.
References:

[1] “Work with DynamoDB - AWS SDK for Java 2.x,” docs.aws.amazon.com.
[Online]. Available: https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/examples-dynamodb.html. [Accessed: 23 July 2023].

[2] R. Katrodiya, “CSCI 5410 Assignment 1.” Summer Term, Dalhousie University, [Online document], 2023. [Accessed: 23 July 2023].
 */
