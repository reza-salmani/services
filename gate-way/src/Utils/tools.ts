import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import * as bcript from 'bcrypt';
import * as os from 'os';
import { promisify } from 'util';
import { exec } from 'child_process';
import { JwtService } from '@nestjs/jwt';
import { Context } from 'vm';
import { PrismaService } from '@base/services/prisma-client';

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
    return await bcript.hash(password, await bcript.genSalt(10));
  },
  compareHash: async (password: string, hash: string) => {
    return bcript.compareSync(password, hash);
  },
  getNumberFromString: (str: string) => {
    return str.replace(/[^\d]/g, ' ').trim().split(/\s+/).map(Number);
  },
  matchs: (item1: string[], item2: string[]) => {
    return item1.some((x) => item2.some((y) => y === x));
  },
  equal: (item1: string, item2: string) => {
    return item1.toLowerCase() === item2.toLowerCase();
  },
  getDriveSize(): Promise<{ total: number; free: number }> {
    return new Promise((resolve, reject) => {
      const platform = os.platform();
      const driveLetter = __dirname.charAt(0).toUpperCase();

      let cmd = '';

      if (platform === 'win32') {
        cmd = `powershell -command "Get-PSDrive -Name ${driveLetter} | Select-Object Used,Free,UsedCapacity,FreeCapacity"`;
      } else if (platform === 'darwin' || platform === 'linux') {
        cmd = `df -k ${__dirname} | tail -1`;
      }

      exec(cmd, (error, stdout) => {
        if (error) {
          return reject(error);
        }

        let total, free;
        if (platform === 'win32') {
          const output = stdout.trim().split(/\s+/);
          free = Math.ceil((Number(output[9]) - Number(output[8])) / 1000000); // Free space in bytes
          total = Math.ceil(Number(output[9]) / 1000000); // Total space in bytes
        } else {
          const data = stdout.trim().split(/\s+/);
          total = Number(data[1]) * 1024;
          free = Number(data[3]) * 1024;
        }
        resolve({ total, free });
      });
    });
  },
  //#region ------------- IsAuthenticated ------------------
  async GetUserInfoFromContext(
    ctx: Context,
    jwtService: JwtService,
    prismaService: PrismaService,
  ) {
    if (ctx.req && ctx.req.cookies && ctx.req.cookies['jwt']) {
      let userId = jwtService.decode(ctx.req.cookies['jwt']).sub;
      let existUserAuth = await prismaService.auth.findFirst({
        where: { userId: { equals: userId } },
      });
      if (existUserAuth) {
        return existUserAuth;
      } else {
        return null;
      }
    } else {
      return null;
    }
  },
  //#endregion
  flattenArray: (arr: any) => {
    return arr.reduce((flat: any, item: any) => {
      return flat.concat(Array.isArray(item) ? Tools.flattenArray(item) : item);
    }, []);
  },
};
