import { Request, Response } from "express";
import AppError from "../../../utils/error";
import Address from "../../../models/address";
import kyc from "../../../models/kyc";

interface S3File extends Express.Multer.File {
    location: string; // The S3 URL
}

export const addKyc = async (req: Request, res: Response) => {
    const { emirates_id, passport_no, source_of_funds } = req.body;
    const userId = (req as any).user?.user_id;

    // Uploaded files
    const files = req.files as {
        [fieldname: string]: S3File[];
    };

    const emiratesIdFrontImg = files["emirates_id_front_img"]?.[0]?.location;
    const emiratesIdBackImg = files["emirates_id_back_img"]?.[0]?.location;
    const visaCopyImg = files["visa_copy"]?.[0]?.location;

    if (!emirates_id || !emiratesIdFrontImg || !emiratesIdBackImg || !source_of_funds)
        throw new AppError(400, "Please provide all required kyc details!");

    // Check user address exists
    const address = await Address.findOne({ user_id: userId });
    if (!address)
        throw new AppError(404, "Address details not found.");
    
    const kycData: any = {};

    kycData.user_id = userId;
    kycData.address_id = address._id;
    kycData.emirates_id = emirates_id;
    kycData.emirates_id_front_img = emiratesIdFrontImg;
    kycData.emirates_id_back_img = emiratesIdBackImg;
    kycData.source_of_funds = source_of_funds;

    // Optional fields
    if (passport_no !== "" && passport_no !== undefined)
        kycData.passport_no = passport_no;
    if (visaCopyImg !== "" && visaCopyImg !== undefined)
        kycData.visa_copy = visaCopyImg;

    const kycRes = await kyc.create(kycData);

    res.json({
        success: true,
        message: "Kyc submitted successfully.",
        data: {
            kyc: kycRes
        }
    });
}