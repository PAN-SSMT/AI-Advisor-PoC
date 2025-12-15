import CryptoJS from 'crypto-js';


export const decipher = (message: string, key: string, iv: string): any =>{
    const int_key = CryptoJS.enc.Utf8.parse(key); 
    const int_iv = CryptoJS.enc.Utf8.parse(iv);

    const options = {
        iv: int_iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    };

    let decrypted = CryptoJS.AES.decrypt(message, int_key, options);
    return decrypted.toString(CryptoJS.enc.Utf8)
}
