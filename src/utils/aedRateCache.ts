import Config from "../models/config";

export let usdToAedGoldRate: number;

export async function loadUsdToAedGoldRate() {
    const config = await Config.findOne({ key: "usd_to_aed_gold_rate" });

    if (config && config.value) usdToAedGoldRate = config.value;
}