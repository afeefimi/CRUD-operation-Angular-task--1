import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';


@Injectable({
  providedIn: 'root'
})
export class EncryptionService {
  private secretKey = this.generateSecretKey(); // Generate a secure secret key

  private generateSecretKey(): string {
    // Generate a random string of characters to use as the secret key
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let secretKey = '';
    const length = 32; 

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      secretKey += characters.charAt(randomIndex);
    }

    return secretKey;
  }
  encrypt(data: string): string {
    const encryptedData = CryptoJS.AES.encrypt(data, this.secretKey).toString();
    const encodedData = btoa(encryptedData);
    return encodedData;
  }

  decrypt(encryptedData: string): string {
    const decodedData = atob(encryptedData);
    const decryptedData = CryptoJS.AES.decrypt(decodedData, this.secretKey).toString(CryptoJS.enc.Utf8);
    return decryptedData;
  }

}
