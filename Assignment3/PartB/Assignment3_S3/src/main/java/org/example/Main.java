package org.example;

import com.amazonaws.AmazonServiceException;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicSessionCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.AmazonS3Exception;
import com.amazonaws.services.s3.model.Bucket;

import java.io.File;
import java.nio.file.Paths;
import java.util.Scanner;

public final class Main {
    // Add your AWS credentials
    private static final String AWS_ACCESS_KEY = "YOUR AWS ACCESS KEY";
    private static final String AWS_SECRET_KEY = "YOUR AWS SECRET KEY";
    private static final String AWS_SESSION_TOKEN = "YOUR AWS SESSION TOKEN";
    private static final BasicSessionCredentials AWS_CREDENTIALS = new BasicSessionCredentials(AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_SESSION_TOKEN);
    private final AmazonS3 amazonS3Client;
    private final Regions region = Regions.US_EAST_1;

    //Initialization of AWS S3 client
    public Main()
    {
        amazonS3Client = createAWSS3ClientBuilder();
    }

    public static void main(String[] args) {
        final Scanner sc = new Scanner(System.in);

        //Get the bucket names from console
        String bucketName1 = null;
        while (bucketName1 == null || bucketName1.trim().isEmpty()) {
            System.out.println("Enter the name of the first S3 Bucket:");
            bucketName1 = sc.nextLine();
        }

        String bucketName2 = null;
        while (bucketName2 == null || bucketName2.trim().isEmpty()) {
            System.out.println("Enter the name of the second S3 Bucket:");
            bucketName2 = sc.nextLine();
        }

        // Initialize the file path to upload the file to bucket
        String filePath = "D:\\term3\\Serverless\\Assignments\\Assignment3\\Assignment3_S3\\tech\\tech\\003.txt";


        final Main m = new Main();
        m.execute(bucketName1, bucketName2, filePath);
    }

    private AmazonS3 createAWSS3ClientBuilder() {
        return AmazonS3ClientBuilder.standard().withCredentials(new AWSStaticCredentialsProvider(AWS_CREDENTIALS)).withRegion(region).build();
    }

    // Method getBucketIfExists is used to check that bucket is already exists or not
    private Bucket getBucketIfExists(String bucketName) {
        try {
            return amazonS3Client.listBuckets().stream().filter(bucket -> bucket.getName().equals(bucketName)).findFirst().orElse(null);
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Error occurred while retrieving bucket: " + e.getMessage());
            return null;
        }
    }

    //Create a S3 bucket if bucket does not exist
    private Bucket createBucketIfNotExists(String bucketName) {
        try {
            if (amazonS3Client.doesBucketExistV2(bucketName)) {
                System.out.println("Bucket " + bucketName + " already exists!");
                return getBucketIfExists(bucketName);
            } else {
                System.out.println("Creating bucket " + bucketName + "...");
                return amazonS3Client.createBucket(bucketName);
            }
        } catch (AmazonS3Exception e) {
            e.printStackTrace();
            System.err.println(e.getErrorMessage());
            return null;
        }
    }

    // Method uploadObject is used to upload file in the bucket
    private void uploadObject(String bucketName, String filePath) {
        File file = new File(filePath);
        String keyName = Paths.get(filePath).getFileName().toString();
        System.out.println("Uploading " + filePath + " to S3 bucket " + bucketName + "...");
        try {
            amazonS3Client.putObject(bucketName, keyName, file);
            System.out.println("File has been uploaded successfully.");
            System.out.println();
            System.out.println();
        } catch (AmazonServiceException e) {
            e.printStackTrace();
            System.err.println(e.getMessage());
        }
    }

    public void execute(String bucketName1, String bucketName2, String filePath) {
        try {
            // Create the first bucket or get the existing one
            Bucket s3Bucket1 = createBucketIfNotExists(bucketName1);
            if (s3Bucket1 != null) {
                System.out.println("Bucket created successfully: " + s3Bucket1.getName() + ".");
                System.out.println("Working with bucket: " + s3Bucket1.getName() + ".");
                System.out.println();
                System.out.println();

                uploadObject(s3Bucket1.getName(), filePath);
            } else {
                System.err.println("Error working with bucket: " + bucketName1 + ".");
                return;
            }


            Bucket s3Bucket2 = createBucketIfNotExists(bucketName2);
            if (s3Bucket2 != null) {
                System.out.println("Bucket created successfully: " + s3Bucket2.getName() + ".");


            } else {
                System.err.println("Error working with bucket: " + bucketName2 + ".");
            }


        } catch (Exception e) {
            e.printStackTrace();
            System.err.println(e.getMessage());
        }
    }
}

/*
I referred below source to create DynamoDB table using java SDK as I reused my assignment  1 code.
References:

[1] “Work with Amazon S3 - AWS SDK for Java 2.x,” docs.aws.amazon.com. [Online]. Available:
https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/examples-s3.html. [Accessed: 23 July 2023].

[2] R. Katrodiya, “CSCI 5410 Assignment 1.” Summer Term, Dalhousie University, [Online document], 2023. [Accessed: 23 July 2023].
 */
