import { Types } from "mongoose";

export interface TTest {
    accepted: boolean;
    fileUrl: string;
    user: Types.ObjectId;
}