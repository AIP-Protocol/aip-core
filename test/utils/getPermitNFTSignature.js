const { constants } = require("ethers");
const { splitSignature } = require("ethers/lib/utils");

async function getPermitNFTSignature(
  wallet,
  planManager,
  spender,
  tokenId,
  deadline = constants.MaxUint256,
  permitConfig
) {
  const [nonce, name, version, chainId] = await Promise.all([
    permitConfig?.nonce ??
      planManager.getPlan(tokenId).then((p) => p.plan.nonce),
    permitConfig?.name ?? planManager.name(),
    permitConfig?.version ?? "1",
    permitConfig?.chainId ?? wallet.getChainId(),
  ]);

  return splitSignature(
    await wallet._signTypedData(
      {
        name,
        version,
        chainId,
        verifyingContract: planManager.address,
      },
      {
        Permit: [
          {
            name: "spender",
            type: "address",
          },
          {
            name: "tokenId",
            type: "uint256",
          },
          {
            name: "nonce",
            type: "uint256",
          },
          {
            name: "deadline",
            type: "uint256",
          },
        ],
      },
      {
        owner: wallet.address,
        spender,
        tokenId,
        nonce,
        deadline,
      }
    )
  );
}

module.exports = getPermitNFTSignature;
