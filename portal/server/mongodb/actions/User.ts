import { hash, verify } from "@node-rs/argon2";
import { generateIdFromEntropySize } from "lucia";
import { UserModel } from "server/mongodb/models/User";
import { Role } from "@/utils/types";
import dbConnect from "server/utils/dbConnect";
import { PASSWORD_SETTINGS } from "@/utils/constants";

export const createUser = async (email: string, password: string) => {
    const passwordHash = await hash(password, PASSWORD_SETTINGS);

    const userId = generateIdFromEntropySize(10);
    await dbConnect();
    return await UserModel.create({
        _id: userId,
        email,
        passwordHash,
        roles: [Role.MEMBER]
    })
}

export const getUserByEmail = async (email: string) => {
    await dbConnect();
    return await UserModel.findOne({ email });
}

export const validatePassword = async (userPassword: string, inputPassword: string) => {
    return await verify(userPassword, inputPassword, PASSWORD_SETTINGS);
}