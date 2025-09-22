import mongoose, { Document, Schema, Types } from "mongoose";

export interface IKyc extends Document {
    user_id: Types.ObjectId;
    address_id: Types.ObjectId;
    emirates_id: string;
    emirates_id_front_img: string;
    emirates_id_back_img: string;
    passport_no: string;
    visa_copy: string;
    source_of_funds: string;
    reason: string;
    status: string;
}

const kycSchema: Schema = new Schema<IKyc>(
    {
        user_id: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        address_id: {
            type: Schema.Types.ObjectId,
            ref: "Address",
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
        visa_copy: {
            type: String,
        },
        source_of_funds: {
            type: String,
            required: true,
        },
        reason: {
            type: String,
        },
        status: {
            type: String,
            enum: ['pending', 'under_review', 'approved', 'rejected'],
            default: "pending",
        },
    },
    {
        timestamps: true,
    }
);

kycSchema.index({ user_id: 1 }, { unique: true });

const Kyc = mongoose.model<IKyc>("Kyc", kycSchema);
export default Kyc;
