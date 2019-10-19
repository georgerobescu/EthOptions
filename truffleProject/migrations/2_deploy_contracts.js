const ERC721 = artifacts.require('./ERC721.sol');
const PriceOracle = artifacts.require('./PriceOracle.sol');
const EthOptionsFactory = artifacts.require('./EthOptionsFactory.sol');
const TokenA = artifacts.require('./TokenA');
const TokenB = artifacts.require('./TokenB.sol');
const BigNumber = require('bignumber.js');
const fs = require('fs');


const Web3 = require('web3');
let ownerAddress;
function pow(input) {
    return new BigNumber(input).times(new BigNumber(10).pow(18));
}
module.exports = function (deployer, network, accounts) {

    ownerAddress = accounts[0];
    if (network == 'development') {
        web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
        ownerAddress = accounts[0];
    }
    else if (network == 'ropsten') {
        web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/g5xfoQ0jFSE9S5LwM1Ei"));
        ownerAddress = accounts[0];
    }
    else if (network == 'mainnet') {
        web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/g5xfoQ0jFSE9S5LwM1Ei"));
        ownerAddress = accounts[0];
    }
    console.log("owner Address", accounts[0]);

    return deployer.deploy(TokenA).then(() => {
        return deployer.deploy(TokenB).then(() => {
            return deployer.deploy(ERC721).then(() => {
                return deployer.deploy(EthOptionsFactory, ERC721.address, { from: ownerAddress }).then(() => {
                    return ERC721.at(ERC721.address).then((IERC721) => {
                        return IERC721.setFactory(EthOptionsFactory.address, { from: ownerAddress }).then(() => {
                            return deployer.deploy(PriceOracle).then(() => {
                                return TokenA.at(TokenA.address).then((baseToken) => {
                                    return baseToken._mint(accounts[1], pow(10000)).then(() => {
                                        return TokenB.at(TokenB.address).then((quoteToken) => {
                                            return quoteToken._mint(accounts[2], pow(10000)).then(() => {
                                                return PriceOracle.at(PriceOracle.address).then((IPriceOracle) => {
                                                    return IPriceOracle.setPrice(TokenA.address, new BigNumber(340).times(new BigNumber(10).pow(18)), { from: ownerAddress }).then(() => {
                                                        return IPriceOracle.setPrice(TokenB.address, new BigNumber(5).times(new BigNumber(10).pow(18)), { from: ownerAddress }).then(() => {
                                                            console.log(`TokenA : ${TokenA.address} \n
                                                            TokenB : ${TokenB.address} \n
                                                            ERC721 : ${ERC721.address} \n
                                                            EthOptionFactory: ${EthOptionsFactory.address}
                                                            `)
                                                            var config = `module.exports = {\nbaseToken : '${TokenA.address}',\n quoteToken : '${TokenB.address}',\n factoryAddress: '${EthOptionsFactory.address}' \n}`
                                                            fs.writeFile('./../address.js',config,function(err){
                                                                if(err)
                                                                console.log("err",err);
                                                                else 
                                                                console.log("address.js created");
                                                            })
                                                
                                                        })
                                                    })
                                                })
                                            })
                                        })
                                    })
                                })

                            })
                        })
                    })
                })
            })
        })
    })
};



