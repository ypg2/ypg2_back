import { promisify } from "node:util";
import { pbkdf2, randomBytes } from "node:crypto";
import jwt from "jsonwebtoken";
import IUserDto from "../dto/user.dto";
import HttpError from "../error/HttpError";
import UserRepository from "../repository/user.repository";

export default class UserService {
  bufLen = 16;
  iterations = 1000;
  repository = new UserRepository();

  signUp = async (dto: IUserDto) => {
    const [row] = await this.repository.selectUser(dto.email);

    if (row) {
      const message = "동일한 email 의 회원이 존재합니다.";
      throw new HttpError(409, message);
    }

    const salt = (await promisify(randomBytes)(this.bufLen)).toString("base64");
    const hashedPassword = (
      await promisify(pbkdf2)(
        dto.password,
        salt,
        this.iterations,
        this.bufLen,
        "sha512"
      )
    ).toString("base64");

    const dao = { ...dto, salt, hashedPassword };
    this.repository.insertUser(dao);
  };

  async logIn(dto: Omit<IUserDto, "username">) {
    const [row] = await this.repository.selectUser(dto.email);

    if (!row) {
      const message = "요청하신 email 의 회원이 존재하지 않습니다.";
      throw new HttpError(400, message);
    }

    const hashedPassword = (
      await promisify(pbkdf2)(
        dto.password,
        row.salt,
        this.iterations,
        this.bufLen,
        "sha512"
      )
    ).toString("base64");

    if (row.hashedPassword !== hashedPassword) {
      const message = `요청하신 password 가 일치하지 않습니다.`;
      throw new HttpError(401, message);
    }

    const accessToken = jwt.sign(
      { userID: row.userID },
      process.env.JWT_SECRET!,
      { expiresIn: "10d" }
    );

    return accessToken;
  }
}
