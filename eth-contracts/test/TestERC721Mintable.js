//Testing the RealEstateERC721Token contract
var ERC721MintableComplete = artifacts.require('MayankERC721Token');

contract('TestERC721Mintable', accounts => {

    const accountone = accounts[0];
    const accounttwo = accounts[1];
    const accountthree = accounts[2];
    const accountfour = accounts[3];
    const accountfive = accounts[4];
    const accountsix = accounts[5];

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new({from: accountone});
            
           // console.log(this.contract.events);
            

           // let ownerChangeEvents = this.contract.OwnerChanged({fromBlock: 0});
           //  console.log(ownerChangeEvents);

     //       this.contract.Transfer({fromBlock: 0}, function(error, event){ console.log(event); })
     /*       .on('data', function(event){
                console.log(event); // same results as the optional callback above
            })
            .on('changed', function(event){
                // remove event from local database
            })
            .on('error', console.error);
            */

         //  this.contract.OwnerChanged({fromBlock: 0}, function(error, event){ console.log(event); })

            // console.log(this.contract);
            // TODO: mint multiple tokens
            let result = await this.contract.mint(accounttwo,1,{from:accountone});
           // console.log(result.logs[0]);
            //console.log('Was able to mint the first token: '+result);
            await this.contract.mint(accountthree,2,{from:accountone});
            await this.contract.mint(accountfour,3,{from:accountone});
            await this.contract.mint(accountfive,4,{from:accountone});


            
        })

        

        it('should return total supply', async function () { 
            let totalSupply = await this.contract.totalSupply.call();
            console.log('Total Supply so far = '+totalSupply);
            assert.equal(totalSupply.toNumber(), 4, "Total Supply is not correct");
            
        })

        it('should get token balance', async function () { 
            let balance_two = await this.contract.balanceOf.call(accounttwo);
            console.log('Balance of accounttwo = '+balance_two);
            assert.equal(balance_two.toNumber(),1,"Accounttwo balance of tokens is correct");
            
            let balance_three = await this.contract.balanceOf.call(accountthree);
            console.log('Balance of accounttwo = '+balance_three);
            assert.equal(balance_three.toNumber(),1,"Accounttwo balance of tokens is correct");
            
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            let tokenURISet1 = 'https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1';
            let tokenURIone = await this.contract.tokenURI.call(1);
            console.log('Base tokenURI at tokenId = 1 is '+tokenURIone);
            assert.equal(tokenURIone, tokenURISet1,'TokenId = 1 URI does not match');  

            let tokenURISet2 = 'https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/2';
            let tokenURItwo = await this.contract.tokenURI.call(2);
            console.log('Base tokenURI at tokenId = 2 is '+tokenURItwo);
            assert.equal(tokenURItwo, tokenURISet2,'TokenId = 2 URI does not match'); 
        })

        it('should transfer token from one owner to another', async function () { 
            let tokenTransfer = await this.contract.transferFrom(accounttwo, accountsix, 1, {from: accounttwo});
            // console.log('Printing the event information for token transfer');
            // console.log(tokenTransfer.logs[0]);
            let tokenOwner = await this.contract.ownerOf.call(1);
            console.log('Accountsix address is '+accountsix);
            console.log('TokenId = 1 new owner is '+tokenOwner);
            assert.equal(tokenOwner, accountsix, 'Token id = 1 transfer did not occur correctly');

            //check balance of accounttwo which should be 0 now that transfer has occured
            let balance_two = await this.contract.balanceOf.call(accounttwo);
            console.log('Balance of accounttwo = '+balance_two);
            assert.equal(balance_two,0,'Balance of accounttwo is not zore - incorrect');

        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new({from: accountone});
        })

        it('should fail when minting when address is not contract owner', async function () { 
            
            let accessDenied = false;
            try {
                let result = await this.contract.mint(accounttwo,1,{from:accounttwo});
            }
            catch(e) {
              accessDenied = true;
            }
            console.log('Boolean accessDenied value = '+accessDenied);
            assert.equal(accessDenied, true, "Accounttwo  not owner");
            
        })

        it('should return contract owner', async function () { 
            let result = await this.contract.getOwner.call();
            console.log('Accountone address is '+accountone);
            console.log('Contract Owner address is '+result);
            assert.equal(result, accountone, 'Owner of the account is not acountone - Incorrect');
        })

    });
})