const {Contract, ContractFactory, utils, BigNumber, constants} =require ('ethers');

const WETH9 =require('../WETH9.json');


const factoryArtifact = require('@uniswap/v2-core/build/UniswapV2Factory.json')
const routerArtifact = require('@uniswap/v2-periphery/build/UniswapV2Router02.json')
const pairArtifact = require('@uniswap/v2-periphery/build/IUniswapV2Pair.json')

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main (){

  const [owner]= await ethers.getSigners();

  const Factory = new ContractFactory(factoryArtifact.abi, factoryArtifact.bytecode,owner);
  const factory = await Factory.deploy(owner.address)
  console.log("Factory",factory.address);


  const Usdt= await ethers.getContractFactory('Tether',owner);
  const usdt = await Usdt.deploy();
  console.log("USDT:", usdt.address)



  const Usdc= await ethers.getContractFactory('UsdCoin',owner);
  const usdc = await Usdc.deploy();
  console.log("USDC:", usdc.address)

  const Weth = new ContractFactory(WETH9.abi,WETH9.bytecode,owner)
  const weth = await Weth.deploy()
  console.log('weth',weth.address);



  
  const Router = new ContractFactory(routerArtifact.abi, routerArtifact.bytecode,owner)
  const router = await Router.deploy(factory.address, weth.address)
  console.log("Router", router.address);



  // await usdt.connect(owner).mint(
  //   owner.address,
  //   utils.parseEther('100000')
  // )

  // await usdc.connect(owner).mint(
  //   owner.address,
  //   utils.parseEther('100000')
  // )

  // const tx1= await factory.createPair(usdt.address,usdc.address, {gasLimit: 30000000})
  // await tx1.wait(); 


  // const pairAddress = await factory.getPair(usdt.address, usdc.address)
  // console.log('Pair Address', pairAddress);

  // const pair = new Contract(pairAddress,pairArtifact.abi,owner)
  // let reserves;
  // reserves = await pair.getReserves()
  // console.log("Reserves",reserves);


  


  // const approval1 = await usdt.approve(router.address,constants.MaxUint256)
  // approval1.wait()
  // const approval2 = await usdc.approve(router.address,constants.MaxUint256)
  // approval2.wait()

  // const token0Amount= utils.parseUnits('100');
  // const token1Amount= utils.parseUnits('100');

  // const deadLine = Math.floor(Date.now()/1000 + (10*60));

  // const addLiquidityTx = await router.connect(owner).addLiquidity(
  //   usdt.address,
  //   usdc.address,
  //   token0Amount,
  //   token1Amount,
  //   0,
  //   0,
  //   owner.address,
  //   deadLine,
  //   { gasLimit: utils.hexlify(1000000)}

  // )

  // addLiquidityTx.wait();

  // reserves=await pair.getReserves();
  // console.log('Reserves', reserves)

}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });