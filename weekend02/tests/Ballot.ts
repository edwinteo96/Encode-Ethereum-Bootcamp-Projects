import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { Ballot } from "../typechain-types";

const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];

function convertStringArrayToBytes32(array: string[]) {
    const bytes32Array = [];
    for (let index = 0; index < array.length; index++) {
        bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
    }
    return bytes32Array;
}

describe("Ballot", function () {
    let ballotContract: Ballot;

    beforeEach(async function () {
        const ballotFactory = await ethers.getContractFactory("Ballot");
        ballotContract = await ballotFactory.deploy(
            convertStringArrayToBytes32(PROPOSALS)
        );
        await ballotContract.deployed();
    });

    describe("when the contract is deployed", function () {
        it("has the provided proposals", async function () {
            for (let index = 0; index < PROPOSALS.length; index++) {
                const proposal = await ballotContract.proposals(index);
                expect(ethers.utils.parseBytes32String(proposal.name)).to.eq(
                    PROPOSALS[index]
                );
            }
        });

        it("has zero votes for all proposals", async function () {
            for (let index = 0; index < PROPOSALS.length; index++) {
                const proposal = await ballotContract.proposals(index);
                expect(proposal.voteCount).to.eq(0);
            }
        });
        it("sets the deployer address as chairperson", async function () {
            const signer = await ethers.getSigners();
            const deployer = signer[0].address;
            const chairperson = await ballotContract.chairperson();
            expect(chairperson).to.eq(deployer);
        });
        it("sets the voting weight for the chairperson as 1", async function () {
            const chairperson = await ballotContract.chairperson();
            const chairpersonVoter = await ballotContract.voters(chairperson);
            const votingWeight = chairpersonVoter.weight;
            expect(votingWeight).to.eq(BigNumber.from("1"));
        });
    });

    describe("when the chairperson interacts with the giveRightToVote function in the contract", function () {
        it("gives right to vote for another address", async function () {
            const signer = await ethers.getSigners();
            const voter = signer[1].address;
            await ballotContract.giveRightToVote(voter);

            const ballotVoter = await ballotContract.voters(voter);
            const votingWeight = ballotVoter.weight;
            expect(votingWeight).to.eq(BigNumber.from("1"));
        });
        it("can not give right to vote for someone that has voted", async function () {
            const signer = await ethers.getSigners();
            const voter = signer[1].address;

            await ballotContract.giveRightToVote(voter);
            ballotContract.attach(voter)
            await ballotContract.vote(0);

            const chairperson = signer[0].address;
            ballotContract.attach(chairperson);
            await expect(ballotContract.giveRightToVote(voter)).to.be.reverted;

        });
        it("can not give right to vote for someone that has already voting rights", async function () {
            const signer = await ethers.getSigners();
            const voter = signer[1].address;
            await ballotContract.giveRightToVote(voter);

            await expect(ballotContract.giveRightToVote(voter)).to.be.reverted;
        });
    });

    describe("when the voter interact with the vote function in the contract", function () {
        it("should register the vote", async () => {
            const signer = await ethers.getSigners();
            const voter = signer[1].address;

            await ballotContract.giveRightToVote(voter);
            ballotContract.attach(voter);
            await ballotContract.vote(0);

            const proposal = await ballotContract.proposals(0);
            expect(proposal.voteCount).to.eq(BigNumber.from("1"));
        });
    });

    describe("when the voter interact with the delegate function in the contract", function () {
        // TODO
        it("should transfer voting power", async () => {
            throw Error("Not implemented");
        });
    });

    describe("when the an attacker interact with the giveRightToVote function in the contract", function () {
        // TODO
        it("should revert", async () => {
            throw Error("Not implemented");
        });
    });

    describe("when the an attacker interact with the vote function in the contract", function () {
        // TODO
        it("should revert", async () => {
            throw Error("Not implemented");
        });
    });

    describe("when the an attacker interact with the delegate function in the contract", function () {
        // TODO
        it("should revert", async () => {
            throw Error("Not implemented");
        });
    });

    describe("when someone interact with the winningProposal function before any votes are cast", function () {
        // TODO
        it("should return 0", async () => {
            throw Error("Not implemented");
        });
    });

    describe("when someone interact with the winningProposal function after one vote is cast for the first proposal", function () {
        // TODO
        it("should return 0", async () => {
            throw Error("Not implemented");
        });
    });

    describe("when someone interact with the winnerName function before any votes are cast", function () {
        // TODO
        it("should return name of proposal 0", async () => {
            throw Error("Not implemented");
        });
    });

    describe("when someone interact with the winnerName function after one vote is cast for the first proposal", function () {
        // TODO
        it("should return name of proposal 0", async () => {
            throw Error("Not implemented");
        });
    });

    describe("when someone interact with the winningProposal function and winnerName after 5 random votes are cast for the proposals", function () {
        // TODO
        it("should return the name of the winner proposal", async () => {
            throw Error("Not implemented");
        });
    });
});
