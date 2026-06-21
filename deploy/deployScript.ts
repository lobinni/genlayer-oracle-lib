// deploy/deployScript.ts
import { createClient } from 'genlayer-js';
import { testnetBradbury } from 'genlayer-js/chains';

async function deployContract(client: any, name: string, path: string, args: any[]) {
  console.log(`📦 Deploying ${name}...`);
  const receipt = await client.deployContract({ contractCode: path, args });
  console.log(`✅ ${name} deployed at ${receipt.contractAddress}`);
  return receipt.contractAddress;
}

export default async function main(client: ReturnType<typeof createClient>) {
  const weatherAddr = await deployContract(
    client,
    "WeatherOracle",
    "contracts/weather_oracle.py",
    ["Hanoi", "https://your-gateway.com/weather?city={city}"],
  );

  const priceAddr = await deployContract(
    client,
    "PriceOracle",
    "contracts/price_oracle.py",
    ["https://your-gateway.com/price?symbol={symbol}"],
  );

  console.log({ weatherAddr, priceAddr });
}