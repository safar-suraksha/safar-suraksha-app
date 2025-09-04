import storeIDHash from "../scripts/mintID"

async function registerTouristIDOnChain(touristAddress, dataHash) {
  try {
    await storeIDHash(touristAddress, dataHash);
    return true;
  } catch (err) {
    console.error("Blockchain registration failed:", err);
    return false;
  }
}

export default registerTouristIDOnChain
