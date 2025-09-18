import mongoose, { Document, Schema, Types } from "mongoose";

export interface IKyc extends Document {
    user_id: Types.ObjectId;
    emirates_id: string;
    emirates_id_front_img: string;
    emirates_id_back_img: string;
    passport_no: string;
    passport_img: string;
    visa_copy: string;
    source_of_funds: string;
    status: string;
}

const kycSchema: Schema = new Schema<IKyc>(
    {
        user_id: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        emirates_id: {
            type: String,
            required: true,
        },
        emirates_id_front_img: {
            type: String,
            required: true,
        },
        emirates_id_back_img: {
            type: String,
            required: true,
        },
        passport_no: {
            type: String,
        },
        passport_img: {
            type: String,
        },
        visa_copy: {
            type: String,
        },
        source_of_funds: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
            default: "pending",
        },
    },
    {
        timestamps: true,
    }
);

const kyc = mongoose.model<IKyc>("Kyc", kycSchema);
export default kyc;
