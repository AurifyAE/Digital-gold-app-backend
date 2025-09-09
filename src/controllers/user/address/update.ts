import { Request, Response } from "express";
import AppError from "../../../utils/error";
import Address from "../../../models/address";

export const updateAddress = async (req: Request, res: Response) => {
    const { id, street, district, city, state, postal_code } = req.body;
    
    if (!id) throw new AppError(400, "Please provide address id.");

    const address = await Address.findById(id);
    if (!address) throw new AppError(404, "Address not found.");

    const addressData: any = {};

    // Validate and add street if provided
    if (street !== undefined && street !== "") addressData.street = street;
    // Validate and add district if provided
    if (district !== undefined && district !== "") addressData.district = district;
    // Validate and add city if provided
    if (city !== undefined && city !== "") addressData.city = city;
    // Validate and add state if provided
    if (state !== undefined && state !== "") addressData.state = state;
    // Validate and add postal code if provided
    if (postal_code !== undefined && postal_code !== "") addressData.postal_code = postal_code;

    if (Object.keys(addressData).length === 0)
        throw new AppError(400, "Please provide at least one field to update.");

        // Update scheme
    const updatedAddress = await Address.findByIdAndUpdate(id, addressData, {
        new: true,
    });

    res.json({
        success: true,
        message: "Address updated successfully.",
        data: updatedAddress,
    });
}