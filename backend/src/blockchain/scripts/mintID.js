import dotenv from "dotenv"
dotenv.config()
import { ethers } from "hardhat"
import fs from "fs"
import path from "path"

const CONTRACT_ADDRESS = process.env.TOURISTID_CONTRACT;

async function storeIDHash(touristAddress, dataHash) {
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  
  const artifact = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "../artifacts/contracts/TouristID.sol/TouristID.json"),
      "utf8"
    )
  );

  const contract = new ethers.Contract(CONTRACT_ADDRESS, artifact.abi, wallet);
  const tx = await contract.registerID(dataHash);
  await tx.wait();
  console.log("Hash stored on-chain for:", touristAddress);
}

export default storeIDHash;
