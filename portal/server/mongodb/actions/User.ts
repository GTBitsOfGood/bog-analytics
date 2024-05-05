import { hash } from "@node-rs/argon2";
import { generateIdFromEntropySize } from "lucia";
import { UserModel } from "server/mongodb/models/User";
import { Role } from "@/utils/types";
import dbConnect from "server/utils/dbConnect";

export const createUser = async (email: string, password: string) => {
    const passwordHash = await hash(password, {
        // recommended minimum parameters
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1
    });

    const userId = generateIdFromEntropySize(10);
    await dbConnect();
    return await UserModel.create({
        _id: userId,
        email,
        passwordHash,
        roles: [Role.MEMBER]
    })
} 