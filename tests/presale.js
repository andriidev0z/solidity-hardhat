// This is an example test file. Hardhat will run every *.js file in `test/`,
// so feel free to add new ones.

// Hardhat tests are normally written with Mocha and Chai.

// We import Chai to use its asserting functions here.
const { expect } = require("chai");

// We use `loadFixture` to share common setups (or fixtures) between tests.
// Using this simplifies your tests and makes them run faster, by taking
// advantage of Hardhat Network's snapshot functionality.
const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { ethers } = require("hardhat");

// `describe` is a Mocha function that allows you to organize your tests.
// Having your tests organized makes debugging them easier. All Mocha
// functions are available in the global scope.
//
// `describe` receives the name of a section of your test suite, and a
// callback. The callback must define the tests of that section. This callback
// can't be an async function.
describe("Token contract", function () {
    // We define a fixture to reuse the same setup in every test. We use
    // loadFixture to run this setup once, snapshot that state, and reset Hardhat
    // Network to that snapshot in every test.
    async function deployTokenFixture() {
        // Get the Signers here.
        const [owner, addr1, addr2] = await ethers.getSigners();

        // To deploy our contract, we just have to call ethers.deployContract and await
        // its waitForDeployment() method, which happens once its transaction has been
        // mined.
        const atnToken = await ethers.deployContract("Token");

        await atnToken.waitForDeployment();

        const presale = await ethers.deployContract("Presale", [1500, atnToken.address]);
        await presale.waitForDeployment();

        await atnToken.transfer(presale.address, "300000000000000000000000");
        // Fixtures can return anything you consider useful for your tests
        return { presale, atnToken, owner, addr1, addr2 };
    }

    // You can nest describe calls to create subsections.
    describe("Deployment", function () {
        // `it` is another Mocha function. This is the one you use to define each
        // of your tests. It receives the test name, and a callback function.
        //
        // If the callback function is async, Mocha will `await` it.
        it("Should set the right owner", async function () {
        // We use loadFixture to setup our environment, and then assert that
        // things went well
        const { atnToken, owner } = await loadFixture(deployTokenFixture);

        // `expect` receives a value and wraps it in an assertion object. These
        // objects have a lot of utility methods to assert values.

        // This test expects the owner variable stored in the contract to be
        // equal to our Signer's owner.
        expect(await atnToken.owner()).to.equal(owner.address);
        });

        it("Should assign the total supply of tokens to the owner", async function () {
        const { atnToken, owner } = await loadFixture(deployTokenFixture);
        const ownerBalance = await atnToken.balanceOf(owner.address);
        expect(await atnToken.totalSupply()).to.equal(ownerBalance);
        });
    });

    describe("Transactions", function () {
        it("Should transfer tokens between accounts", async function () {
        const { atnToken, owner, addr1, addr2 } = await loadFixture(
            deployTokenFixture
        );
        // Transfer 50 tokens from owner to addr1
        await expect(
            atnToken.transfer(addr1.address, 50)
        ).to.changeTokenBalances(atnToken, [owner, addr1], [-50, 50]);

        // Transfer 50 tokens from addr1 to addr2
        // We use .connect(signer) to send a transaction from another account
        await expect(
            atnToken.connect(addr1).transfer(addr2.address, 50)
        ).to.changeTokenBalances(atnToken, [addr1, addr2], [-50, 50]);
        });

        it("Should emit Transfer events", async function () {
        const { atnToken, owner, addr1, addr2 } = await loadFixture(
            deployTokenFixture
        );

        // Transfer 50 tokens from owner to addr1
        await expect(atnToken.transfer(addr1.address, 50))
            .to.emit(atnToken, "Transfer")
            .withArgs(owner.address, addr1.address, 50);

        // Transfer 50 tokens from addr1 to addr2
        // We use .connect(signer) to send a transaction from another account
        await expect(atnToken.connect(addr1).transfer(addr2.address, 50))
            .to.emit(atnToken, "Transfer")
            .withArgs(addr1.address, addr2.address, 50);
        });

        it("Should fail if sender doesn't have enough tokens", async function () {
        const { atnToken, owner, addr1 } = await loadFixture(
            deployTokenFixture
        );
        const initialOwnerBalance = await atnToken.balanceOf(owner.address);

        // Try to send 1 token from addr1 (0 tokens) to owner.
        // `require` will evaluate false and revert the transaction.
        await expect(
            atnToken.connect(addr1).transfer(owner.address, 1)
        ).to.be.revertedWith("Not enough tokens");

        // Owner balance shouldn't have changed.
        expect(await atnToken.balanceOf(owner.address)).to.equal(
            initialOwnerBalance
        );
        });
    });
    describe("Presale Operation", function () {
        it("Should transfer tokens to accounts", async function () {
            const { presale, atnToken, owner, addr1, addr2 } = await loadFixture(
                deployTokenFixture
            );

            await expect(
                presale.connect(addr1).purchase({ value: "1000000000000000000"})
            ).to.changeTokenBalances(atnToken, [presale, addr1], [-15000000000000000000, 15000000000000000000]);
        });
    });
});