import { Injectable } from "@nestjs/common";
import { compare, genSalt, hash } from "bcrypt";
import { HashingService } from "./hashing.service";

@Injectable()
export class BcryptService implements HashingService {
  SALT_ROUNDS = 12;

  async hash(data: string | Buffer): Promise<string> {
    const salt = await genSalt(this.SALT_ROUNDS);

    return hash(data, salt);
  }

  compare(data: string | Buffer, encrypted: string): Promise<boolean> {
    return compare(data, encrypted);
  }
}
