const { ethers } = require('ethers');
require('dotenv').config()


// Define private key, and providers
const privateKey = process.env.pk; // Replace with your wallet's private key
const provider = new ethers.providers.JsonRpcProvider('https://dapps.shardeum.org/'); // Replace with your RPC URL (e.g., Infura)
const wallet = new ethers.Wallet(privateKey, provider);

// Define contract addresses
const tokenAAddress = '0x797b97a357949F7aF114815de30Bd4E6d9daF534'; // Replace with Token A's address
const tokenBAddress = '0x7F89B8279A1Bc0bdCcC0Ca74A154c2df9b631703'; // Replace with Token B's address
const uniswapRouterAddress = '0x271dD12f372a1ba36d59789a9cDA1F218578D131'; // Uniswap V2 router address

// Define ABI for ERC20, Uniswap, and the mint function
const erc20Abi = [
  'function approve(address spender, uint256 amount) public returns (bool)',
];
const uniswapRouterAbi = [
  'function swapExactTokensForTokensSupportingFeeOnTransferTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external',
];
const tokenAMintAbi = [
  'function mint(address to, uint256 amount) public',
];

// Create contract instances
const tokenA = new ethers.Contract(tokenAAddress, erc20Abi, wallet);
const tokenAMint = new ethers.Contract(tokenAAddress, tokenAMintAbi, wallet);
const uniswapRouter = new ethers.Contract(uniswapRouterAddress, uniswapRouterAbi, wallet);

// Define swap parameters
const amountIn = ethers.utils.parseUnits('1', 18); // Amount of Token A to mint and swap
const amountOutMin = 0; // Minimum amount of Token B to receive
const path = [tokenAAddress, tokenBAddress];
const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from the current timestamp
const toAddress = wallet.address; // Wallet address to receive Token B

async function mintAndSwapTokens() {
  // Mint Token A
  const mintTx = await tokenAMint.mint(wallet.address, amountIn);
  await mintTx.wait();

  // Approve Uniswap Router to spend Token A
  const approveTx = await tokenA.approve(uniswapRouterAddress, amountIn);
  await approveTx.wait();

  // Generate access list for the swap transaction
  const accessList = [
    {
      address: tokenAAddress,
      storageKeys: [],
    },
    {
      address: tokenBAddress,
      storageKeys: [],
    },
    {
      address: uniswapRouterAddress,
      storageKeys: [],
    },
  ];

  // Swap tokens on Uniswap using EIP-2930
  const swapTx = await uniswapRouter.swapExactTokensForTokensSupportingFeeOnTransferTokens(
    amountIn,
    amountOutMin,
    path,
    toAddress,
    deadline,
    {type:1, gasLimit: 500000, gasPrice: ethers.utils.parseUnits('20', 'gwei'), accessList }
  );
  const receipt = await swapTx.wait();
  console.log(`Swap completed in transaction ${receipt.transactionHash}`);
}

mintAndSwapTokens().catch((err) => console.error(err));
