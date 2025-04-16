import crypto from 'crypto';


const encryptKey = Buffer.from(process.env.ENCRYPT_KEY!, 'base64');
const algorithme_key = process.env.ALGORITHME!;

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithme_key, encryptKey, iv);
  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return iv.toString('base64') + ':' + encrypted;
}

export function decrypt(data: string): string {
  const [ivStr, encrypted] = data.split(':');
  const iv = Buffer.from(ivStr, 'base64');
  const decipher = crypto.createDecipheriv(algorithme_key, encryptKey, iv);
  let decrypted = decipher.update(encrypted, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
