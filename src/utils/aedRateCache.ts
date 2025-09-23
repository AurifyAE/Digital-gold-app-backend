import Config from "../models/config";

let usdToAedGoldRate: number;

export function setUsdToAedGoldRate(val: number) {
  usdToAedGoldRate = val;
}

export function getUsdToAedGoldRate(): number {
  return usdToAedGoldRate;
}

export async function loadUsdToAedGoldRate() {
    const config = await Config.findOne({ key: "usd_to_aed_gold_rate" });

    if (config && config.value) usdToAedGoldRate = config.value;
}