import hre from "hardhat"

async function main() {
  const TouristID = await hre.ethers.getContractFactory("TouristID");
  const touristID = await TouristID.deploy();
  await touristID.deployed();
  console.log("TouristID deployed to:", touristID.address);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
