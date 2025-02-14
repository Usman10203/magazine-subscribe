import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export const checkAuth = async (request: NextRequest) => {
    try {
        const token = request.cookies.get("authToken")?.value || '';
        if (!token) {
            return;
        }
        const decodedToken: any = await jwt.verify(token, process.env.TOKEN_SECRET!);
        return decodedToken.id;
    } catch (error: any) {
        throw new Error(error.message);
    }
}

