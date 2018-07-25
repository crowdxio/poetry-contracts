function accounts(rpc_accounts) {
	return {
		DEPLOY_OPERATOR: rpc_accounts[0],
		ASSET_OWNER: rpc_accounts[1],
		AUTHOR1: rpc_accounts[2],
		AUTHOR2: rpc_accounts[3],
		INTRUDER1: rpc_accounts[4],
	};
}

module.exports = {
	accounts: accounts,
};
