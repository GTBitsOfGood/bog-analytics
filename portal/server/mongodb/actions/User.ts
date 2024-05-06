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

export const getAllUsers = async () => {
    await dbConnect();
    return await UserModel.find({});
}

export const validatePassword = async (userPassword: string, inputPassword: string) => {
    return await verify(userPassword, inputPassword, PASSWORD_SETTINGS);
}

export const promoteUser = async (email: string) => {
    await dbConnect();
    const user = await UserModel.findOneAndUpdate({ email }, { roles: [Role.ADMIN, Role.MEMBER] })
    return user
}

export const demoteUser = async (email: string) => {
    await dbConnect();
    const user = await UserModel.findOneAndUpdate({ email }, { roles: [Role.MEMBER] })
    return user
}

export const deleteUser = async (email: string) => {
    await dbConnect();
    const user = await UserModel.findOneAndDelete({ email })
    return user
}
export const verifyUser = async (email: string) => {
    await dbConnect();
    const user = await UserModel.findOneAndUpdate({ email }, { verified: true })
    return user
}

export const unverifyUser = async (email: string) => {
    await dbConnect();
    const user = await UserModel.findOneAndUpdate({ email }, { verified: false })
    return user
}