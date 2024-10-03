import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService implements OnModuleInit {
    private storage: admin.storage.Storage;
    private bucket: any;

    constructor( private config: ConfigService) {}

    async onModuleInit(): Promise<void> {
        await this.connect();
        // TODO: check connect to the storage bucket
        await this.checkBucketExistence();
    }

    private async connect(): Promise<void> {
        const serviceAccount = {
            projectId: this.config.get<string>('FIREBASE_PROJECT_ID'),
            privateKey: this.config.get<string>("FIREBASE_PRIVATE_KEY"),
            clientEmail: this.config.get<string>("FIREBASE_CLIENT_EMAIL"),
        };

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            storageBucket: `${serviceAccount.projectId}.appspot.com`,
          });
      
        this.storage = admin.storage();
        this.bucket = this.storage.bucket();
    }

    private async checkBucketExistence(): Promise<void> {
        const [exists] = await this.bucket.exists();
        if (!exists) {
            throw new Error('Firebase: Storage bucket not found')
        }
        console.log('Firebase: connect to storage bucket successfully')
    }

    async uploadFileByUserId(file: Express.Multer.File, userId: number, type: string): Promise<string> {
        const filePath = `user/${userId}/${type}/${file.originalname}`;
        const fileUpload = this.bucket.file(filePath);

        const fileStream = fileUpload.createWriteStream({
            metadata: {
                contenType: file.mimetype,
            },
            resumable: true,
            validation: false,
            public: true
        })

        await new Promise((resolve, reject) => {
            fileStream.on('error', reject);
            fileStream.on('finish', resolve);
            fileStream.end(file.buffer);
        })

        const signedUrl = await fileUpload.getSignedUrl({
            action: 'read',
            expires: '01-01-2100'
        });

        return signedUrl[0];
    }

    async deleteFileByUserId(userId: number, type: string): Promise<void> {
        const folderPath = `user/${userId}/${type}`;
        try {
            const [files] = await this.bucket.getFiles({ prefix: folderPath });
            if (files.length === 0) throw new NotFoundException('user data not found')
            const deletePromises = files.map(file => file.delete());
            await Promise.all(deletePromises);
        } catch (error) {
        throw error;
        }
    }

    async updateFileByUserId(file: Express.Multer.File, userId: number, type: string): Promise<string> {
        // TODO: Delete older files
        const folderPath = `user/${userId}/${type}`;

        const [files] = await this.bucket.getFiles({ prefix: folderPath });
        if (files.length > 0) {
            const deletePromises = files.map(file => file.delete());
            await Promise.all(deletePromises);
        }

        // TODO: Upload new file
        return this.uploadFileByUserId(file, userId, type);

    }
}
