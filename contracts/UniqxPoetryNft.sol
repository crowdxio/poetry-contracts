pragma solidity ^0.4.23;

import {ERC721Token} from '../zeppelin/contracts/token/ERC721/ERC721Token.sol';
import {Ownable} from '../zeppelin/contracts/ownership/Ownable.sol';

contract UniqxPoetryNft is ERC721Token, Ownable {

	struct TokenMetadata {
		uint timestamp;
		uint copy;
		uint count;
		address author;
	}

	mapping(uint => TokenMetadata) internal metadata;
	mapping(address => bool) internal authors;

	constructor(address _owner)
		public
		ERC721Token("Uniqx Poetry NFT", "PTRY") {

		transferOwnership(_owner);
	}

	function registerAuthor(address _author) public onlyOwner {
		authors[_author] = true;
	}

	function removeAuthor(address _author) public onlyOwner {
		authors[_author] = false;
	}

	modifier onlyAuthor() {
		require(authors[msg.sender]);
		_;
	}

	function massMint(
		string _jsonHash,
		uint _count
	) public onlyAuthor {

		for (uint copy = 1; copy <= _count; copy++) {
			uint tokenId = uint(keccak256(abi.encodePacked(_jsonHash, copy)));

			// this makes sure no more tokens are minted with the same content - jsonHash
			require(!exists(tokenId));

			super._mint(msg.sender, tokenId);
			super._setTokenURI(tokenId, _jsonHash);

			metadata[tokenId].copy = copy;
			metadata[tokenId].count = _count;
			metadata[tokenId].author = msg.sender;
		}
	}

	function getTokenMetadata(uint _tokenId) public view
		returns (
			uint timestamp,
			uint copy,
			uint count,
			address author) {

		require(exists(_tokenId));
		TokenMetadata storage tm = metadata[_tokenId];
		return (
			tm.timestamp,
			tm.copy,
			tm.count,
			tm.author
		);
	}
}
