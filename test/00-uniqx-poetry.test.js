require('babel-register');
require('babel-polyfill');

import EVMRevert from "../zeppelin/test/helpers/EVMRevert";
import {accounts} from './common/common';
const UniqxPoetryNft = artifacts.require("../contracts/UniqxPoetryNft.sol");

let Promise = require('bluebird');
const BigNumber = web3.BigNumber;
let chai = require('chai');
let assert = require('chai').assert;
const should = require('chai')
	.use(require('chai-as-promised'))
	.use(require('chai-bignumber')(BigNumber))
	.should();

contract('UniqxPoetryNft', function (rpc_accounts) {

	let ac = accounts(rpc_accounts);

	let pGetBalance = Promise.promisify(web3.eth.getBalance);
	let pSendTransaction = Promise.promisify(web3.eth.sendTransaction);

	let asset = null;

	it('should be able to deploy the poetry contract and set initial state', async function () {
		asset = await UniqxPoetryNft.new(
			ac.ASSET_OWNER,
			{from: ac.DEPLOY_OPERATOR, gas: 7000000}
		);

		console.log("asset.address= " +asset.address);
	});

	it('should NOT be able to let an unregistered author to mint a token', async function () {
		let jsonHash = web3.sha3("My poem", "content", "1").slice(2);
		await asset.massMint(jsonHash, 1, {from: ac.INTRUDER1, gas: 7000000}).should.be.rejectedWith(EVMRevert);
	})

	it('should NOT be able allow author registration from an account which is not the OWNER', async function () {
		await asset.registerAuthor(ac.AUTHOR1, {from: ac.INTRUDER1, gas: 7000000}).should.be.rejectedWith(EVMRevert);
	})

	it('should ALLOW author registration from an account which is the OWNER', async function () {
		await asset.registerAuthor(ac.AUTHOR1, {from: ac.ASSET_OWNER, gas: 7000000}).should.be.fulfilled;
	})

	it('should ALLOW a registered author to mint a token', async function () {
		let jsonHash = web3.sha3("My poem", "content", "1").slice(2);
		await asset.massMint(jsonHash, 2, {from: ac.AUTHOR1, gas: 7000000}).should.be.fulfilled;
		let balance = await asset.balanceOf(ac.AUTHOR1);
		assert.equal(balance, 2, 'unexpected balance');
	})

});
