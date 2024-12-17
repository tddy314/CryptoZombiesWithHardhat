const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const console = require("console");
const { allowedNodeEnvironmentFlags } = require("process");

describe("zombiefactory", function() {
    async function deployZombieFactory() {
        const [owner, addr1, addr2] = await ethers.getSigners();
        const zombiefac = await ethers.deployContract("ZombieFactory");
        return {zombiefac, owner, addr1, addr2};
    }

    it("Should create new zombie and return its true owner", async function() {
        const {zombiefac, owner} = await loadFixture(deployZombieFactory);
        await zombiefac.connect(owner).createRandomZombie("first");
        const zombie = await zombiefac.zombies(0);
        const zombietoowner = await zombiefac.zombieToOwner(0);
        const zombiesLength = await zombiefac.getZombiesLength();
        expect(zombie.name).to.equal("first");
        expect(zombietoowner).to.equal(owner.address);
        expect(zombiesLength).to.equal(0);
    });

    it("Should announce error when create the second zombie", async function() {
        const {zombiefac, owner} = await loadFixture(deployZombieFactory);
        await zombiefac.connect(owner).createRandomZombie("first");
        await expect(zombiefac.connect(owner).createRandomZombie("second")).to.be.revertedWith("You already have Zombie!");
    })
} );

describe("zombieOwnership", function() {
    async function dpeloyzombieOwnerShip() {
        const [addr1, addr2] = await ethers.getSigners();
        const zombieOwn = await ethers.deployContract("ZombieOwnership");
        return {zombieOwn, addr1, addr2};
    }

    it("Should tranfer zombies with first way", async function () {
        const {zombieOwn, addr1, addr2} = await loadFixture(dpeloyzombieOwnerShip);
        await zombieOwn.connect(addr1).createRandomZombie("zombie1");
        await zombieOwn.connect(addr1).transferFrom(addr1, addr2, 0);
        const retriveOwner = await zombieOwn.zombieToOwner(0);
        expect(retriveOwner).to.equal(addr2.address);
    });

    it("Should tranfer zombies with second way", async function() {
        const {zombieOwn, addr1, addr2} = await loadFixture(dpeloyzombieOwnerShip);
        await zombieOwn.connect(addr1).createRandomZombie("zombie1");
        await zombieOwn.connect(addr1).approve(addr2, 0);
        await zombieOwn.connect(addr2).transferFrom(addr1, addr2, 0);
        const retriveOwner = await zombieOwn.zombieToOwner(0);
        expect(retriveOwner).to.equal(addr2.address);
    })

    it("Should level up your zombies", async function() {
        const {zombieOwn, addr1} = await loadFixture(dpeloyzombieOwnerShip);
        await zombieOwn.connect(addr1).createRandomZombie("zombie1");
        let mess = "";
        let trans;
       
        try {
        trans = await zombieOwn.connect(addr1).levelUp(0, {value: 1000000000000000});
        await trans.wait();
        }
        catch (error) {
            mess = error.message;
        }
       
        const retrivezom = await zombieOwn.zombies(0);
        expect(retrivezom.level).to.equal(2);
    })
});