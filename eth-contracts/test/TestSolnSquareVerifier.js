
var SolnSquareVerifier = artifacts.require('SolnSquareVerifier');
var SquareVerifier = artifacts.require('SquareVerifier');
var Proof = require('../../zokrates/code/square/proof.json');

console.log('Printing values stored in proof.json');
console.log(Proof);
console.log('Proof.proof');
console.log(Proof.proof);
console.log('Proof.inputs');
console.log(Proof.inputs);

contract('TestSolnSquareVerifier', accounts => {

    const accountone = accounts[0];
    const accounttwo = accounts[1];
    const accountthree = accounts[2];
    const accountfour = accounts[3];
    const accountfive = accounts[4];
    const accountsix = accounts[5];

    describe('Solutions Verification and Minting', function () {
        beforeEach(async function () { 
            this.squareVerifier = await SquareVerifier.new({from: accountone});
            this.solnSquareVerifier = await SolnSquareVerifier.new(this.squareVerifier.address, {from: accountone});
        });
    
        // Test if a new solution can be added for contract - SolnSquareVerifier
        it('Should be able to add new solution for contract - SolnSquareVerifier', async function () { 
           
           let result = await this.solnSquareVerifier.testAddSolutions(accounttwo, 1, Proof.proof.a,
                        Proof.proof.b, Proof.proof.c, Proof.inputs, {from: accountone});
            console.log('Verified the solution and added solution to the database - below is the event for the same');
            // Looking for if event AddedSolution was emitted
            console.log(result.logs[0]);

            assert.equal(result.logs[0].args.tokenId, 1, 'TokenId should be = 1 - Incorrect');
            assert.equal(result.logs[0].args.to, accounttwo, 'to address should be accounttwo - Incorrect');
            
        });

        // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
        it('Should be able to mint token once Verifier.sol returns true - SolnSquareVerifier', async function () { 
            
            let result = await this.solnSquareVerifier.mint(accounttwo, 1, Proof.proof.a,
                         Proof.proof.b, Proof.proof.c, Proof.inputs);
            console.log('Verified the solution and minted tokenId = 1');
            // Looking for if event AddedSolution was emitted
            console.log(result.logs);
            assert.equal(result.logs[0].args.tokenId, 1, 'TokenId should be = 1 - Incorrect');
            console.log('Accounttwo address is ');
            console.log(accounttwo);
            assert.equal(result.logs[0].args.to, accounttwo, 'to address should be accounttwo - Incorrect');

            //verify that accounttwo was assigned the tokens minted above
            let balance_two = await this.solnSquareVerifier.balanceOf.call(accounttwo);
            console.log('Balance of accounttwo = '+balance_two);
            assert.equal(balance_two.toNumber(),1,"Accounttwo balance of tokens is correct");
             
        });

    });
});


