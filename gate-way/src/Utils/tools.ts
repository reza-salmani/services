import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import * as bcript from 'bcrypt';
import { promisify } from 'util';

export let Tools = {
  encript: async (text: string) => {
    let iv = randomBytes(16);
    let password = 'we do encript to secure out text';
    let key = (await promisify(scrypt)(password, 'salt', 32)) as Buffer;
    let cipher = createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  },
  decript: async (text: string) => {
    let iv = randomBytes(16);
    let password = 'we do encript to secure out text';
    let key = (await promisify(scrypt)(password, 'salt', 32)) as Buffer;
    let decipher = createDecipheriv('aes-256-ctr', key, iv);
    let decryptedText = Buffer.concat([
      decipher.update(Buffer.from(text, 'hex')),
      decipher.final(),
    ]);
    return decryptedText.toString();
  },
  hash: async (password: string) => {
    return bcript.hashSync(password, bcript.genSaltSync(10));
  },
  compareHash: async (password: string, hash: string) => {
    return bcript.compareSync(password, hash);
  },
};
