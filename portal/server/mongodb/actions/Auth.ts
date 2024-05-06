import jwt from "jsonwebtoken";

export const generatePortalToken = () => {
    const token = jwt.sign({ verified: true }, process.env.JWT_SECRET ?? "secret", { expiresIn: "1h" });
    return token
}

export const validatePortalToken = (portalToken: string) => {
    const token = jwt.verify(portalToken, process.env.JWT_SECRET ?? "secret") as jwt.JwtPayload;
    return token.verified;
}
