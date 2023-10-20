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
import java.util.List;
import java.util.Scanner;

public final class Main {
    private static final String AWS_ACCESS_KEY = "ASIARPPBFXJT2TKJIDZ5";
    private static final String AWS_SECRET_KEY = "6PNsFbfPt/SRgxxSnhW+NdNZum3u8gKAN1LsXbYB";
    private static final String AWS_SESSION_TOKEN = "FwoGZXIvYXdzEBUaDEi1Yr4e5YEemc3GeSLAAcTJt6U2LLF4PrfwqFP9S8554AAPWCrYd9xATXCgsqhN8zS544I2PXkvbmR0WsWblpESVnfbI4PgbL01rkTbcXvPRDPBraxN8lLDwzvJrBNAzEGmVU/7XUmuJIIbpTZ/9ooQtThvQRZVQlG/u+JQP3c2r9LsfMkNbnH0UoAppFg0rMCVQjO4X4MH6CldF7FivtRWo6vvd17YgFKZR3gmctM5b+Ap8RQ4HbBi4sIzObrRvjgYS47Jz+mA1kGdY8UQtCjvjP6jBjItdbptaXUoAjAlmIMXz6ryZe54SvuU25/e7LflvoO8w/mDrW6DXl2xCMvQhCgp";
    private static final BasicSessionCredentials AWS_CREDENTIALS = new BasicSessionCredentials(AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_SESSION_TOKEN);

    private final AmazonS3 amazonS3Client;

    public Main()
    {
        amazonS3Client = createAWSS3ClientBuilder();
    }

    // Create an instance of AmazonS3 client using provided credentials and region
    private AmazonS3 createAWSS3ClientBuilder()
    {
        return AmazonS3ClientBuilder.standard()
                .withCredentials(new AWSStaticCredentialsProvider(AWS_CREDENTIALS))
                .withRegion(Regions.US_EAST_1)
                .build();
    }

    // Check if a bucket is already exists with the given name and return it if found
    private Bucket getBucketIfExists(String bucketName)
    {
        List<Bucket> allBuckets = amazonS3Client.listBuckets();
        for (Bucket s3Bucket : allBuckets)
        {
            if (s3Bucket.getName().equals(bucketName))
            {
                return s3Bucket;
            }
        }
        return null;
    }

    // Create a new bucket with the given name if it doesn't already exist
    private Bucket createBucketIfNotExists(String bucketName)
    {
        if (amazonS3Client.doesBucketExistV2(bucketName))
        {
            System.out.println("Bucket " + bucketName + " already exists!");
            return getBucketIfExists(bucketName);
        }
        else
        {
            try
            {
                System.out.println("Creating bucket " + bucketName + "...");
                return amazonS3Client.createBucket(bucketName);
            }
            catch (AmazonS3Exception e)
            {
                e.printStackTrace();
                System.err.println(e.getErrorMessage());
            }
        }
        return null;
    }

    // Upload a index.html file to the created S3 bucket
    private void uploadObject(String bucketName)
    {
        String filePath = "C:\\Assignment1\\index.html";
        File file = new File(filePath);
        String keyName = Paths.get(filePath).getFileName().toString();
        System.out.println("Uploading " + filePath + " to S3 bucket " + bucketName + "...");
        try
        {
            amazonS3Client.putObject(bucketName, keyName, file);
            System.out.println("File has been uploaded successfully.");
        }
        catch (AmazonServiceException e)
        {
            e.printStackTrace();
            System.err.println(e.getMessage());
        }
    }
    public void execute(String bucketName)
    {
        try
        {
            // Check if the bucket exists or create a new one
            Bucket s3Bucket = createBucketIfNotExists(bucketName);
            if (s3Bucket != null)
            {
                System.out.println("Working with bucket: " + s3Bucket.getName() + ".");

                // Upload an object to the bucket
                uploadObject(s3Bucket.getName());
            }
            else
            {
                System.err.println("Error working with bucket: " + bucketName + ".");
            }
        }
        catch (Exception e)
        {
            e.printStackTrace();
            System.err.println(e.getMessage());
        }
    }

    public static void main(String[] args)
    {
        final Scanner sc = new Scanner(System.in);

        String bucketName = null;
        while (bucketName == null || bucketName.trim().isEmpty())
        {
            System.out.println("Enter the name of S3 Bucket:");
            bucketName = sc.nextLine();
        }

        //Created the object of Main class and called the execute method
        final Main m = new Main();
        m.execute(bucketName);
    }
}
