import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";

const BUCKET_NAME = 'mindmap-uploads-sharjidh';

// Validate credentials
if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    throw new Error('AWS credentials not found in environment variables');
}

console.log('AWS Region:', process.env.AWS_REGION);
console.log('AWS Access Key ID:', process.env.AWS_ACCESS_KEY_ID?.substring(0, 5) + '...');

const s3Client = new S3Client({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

export const uploadToS3 = async (file: Buffer, fileName: string) => {
    // Validate credentials again at upload time
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
        throw new Error('AWS credentials not found when uploading');
    }

    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: file,
        ContentType: 'image/*',
    });

    try {
        await s3Client.send(command);
        return `https://${BUCKET_NAME}.s3.amazonaws.com/${fileName}`;
    } catch (error) {
        console.error('Error uploading to S3:', error);
        console.error('Current credentials:', {
            region: process.env.AWS_REGION,
            accessKeyId: process.env.AWS_ACCESS_KEY_ID?.substring(0, 5) + '...',
            hasSecretKey: !!process.env.AWS_SECRET_ACCESS_KEY
        });
        throw error;
    }
};

export const getSignedUrl = async (key: string) => {
    const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
    });

    try {
        const url = await s3Client.send(command);
        return url;
    } catch (error) {
        console.error('Error getting signed URL:', error);
        throw error;
    }
};
