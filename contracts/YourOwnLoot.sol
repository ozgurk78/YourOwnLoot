// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract YourOwnLoot is ERC721, Ownable, ReentrancyGuard {
    uint16 MAX_SUPPLY = 10000;

    struct Token {
        string s1;
        string s2;
        string s3;
        string s4;
        string s5;
        bool b;
    }

    mapping(uint16 => Token) internal _tokens;

    constructor() ERC721("YourOwnLoot", "YOL") onlyOwner {}

    function mint(
        uint16 _tokenId,
        string calldata _spec1,
        string calldata _spec2,
        string calldata _spec3,
        string calldata _spec4,
        string calldata _spec5
    ) external nonReentrant {
        require(
            _tokenId >= 0 && _tokenId < MAX_SUPPLY,
            "_tokenId must be between 0 and 10000"
        );
        _safeMint(msg.sender, _tokenId);
        _tokens[_tokenId] = Token(
            _spec1,
            _spec2,
            _spec3,
            _spec4,
            _spec5,
            false
        );
    }

    function getSvgHeader() internal pure returns (string memory) {
        return
            '<svg version="1.2" baseProfile="tiny-ps" xmlns="http://www.w3.org/2000/svg" width="768" height="768"><style>tspan{white-space:pre;font-size:35px;fill:#f1f1f1;}</style><rect width="100%" height="100%" fill="black" /><text>';
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721)
        returns (string memory)
    {
        require(
            tokenId >= 0 && tokenId < MAX_SUPPLY,
            "_tokenId must be between 0 and 10000"
        );
        super.tokenURI(tokenId);
        require(_tokens[uint16(tokenId)].b == false, "banned");
        Token memory token = _tokens[uint16(tokenId)];
        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    encode(
                        bytes(
                            abi.encodePacked(
                                '{"name": "Your Own Loot #',
                                toString(tokenId),
                                '", "description": "loots that can be created and stored on-chain.", "image": "data:image/svg+xml;base64,',
                                string(
                                    encode(
                                        bytes(
                                            abi.encodePacked(
                                                getSvgHeader(),
                                                '<tspan x="50" y="100">',
                                                token.s1,
                                                '</tspan><tspan x="50" y="150">',
                                                token.s2,
                                                '</tspan><tspan x="50" y="200">',
                                                token.s3,
                                                '</tspan><tspan x="50" y="250">',
                                                token.s4,
                                                '</tspan><tspan x="50" y="300">',
                                                token.s5,
                                                '</tspan><tspan x="500" y="700">#',
                                                toString(tokenId),
                                                "</tspan></text></svg>"
                                            )
                                        )
                                    )
                                ),
                                '"}'
                            )
                        )
                    ),
                    "#"
                )
            );
    }

    function toggleBan(uint16 _tokenId) external onlyOwner nonReentrant {
        _tokens[_tokenId].b = !_tokens[_tokenId].b;
    }

    // @title Base64
    // @author Brecht Devos - <brecht@loopring.org>
    // @notice Provides a function for encoding some bytes in base64
    function encode(bytes memory data) internal pure returns (string memory) {
        string
            memory TABLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

        if (data.length == 0) return "";

        // load the table into memory
        string memory table = TABLE;

        // multiply by 4/3 rounded up
        uint256 encodedLen = 4 * ((data.length + 2) / 3);

        // add some extra buffer at the end required for the writing
        string memory result = new string(encodedLen + 32);

        assembly {
            // set the actual output length
            mstore(result, encodedLen)

            // prepare the lookup table
            let tablePtr := add(table, 1)

            // input ptr
            let dataPtr := data
            let endPtr := add(dataPtr, mload(data))

            // result ptr, jump over length
            let resultPtr := add(result, 32)

            // run over the input, 3 bytes at a time
            for {

            } lt(dataPtr, endPtr) {

            } {
                dataPtr := add(dataPtr, 3)

                // read 3 bytes
                let input := mload(dataPtr)

                // write 4 characters
                mstore(
                    resultPtr,
                    shl(248, mload(add(tablePtr, and(shr(18, input), 0x3F))))
                )
                resultPtr := add(resultPtr, 1)
                mstore(
                    resultPtr,
                    shl(248, mload(add(tablePtr, and(shr(12, input), 0x3F))))
                )
                resultPtr := add(resultPtr, 1)
                mstore(
                    resultPtr,
                    shl(248, mload(add(tablePtr, and(shr(6, input), 0x3F))))
                )
                resultPtr := add(resultPtr, 1)
                mstore(
                    resultPtr,
                    shl(248, mload(add(tablePtr, and(input, 0x3F))))
                )
                resultPtr := add(resultPtr, 1)
            }

            // padding with '='
            switch mod(mload(data), 3)
            case 1 {
                mstore(sub(resultPtr, 2), shl(240, 0x3d3d))
            }
            case 2 {
                mstore(sub(resultPtr, 1), shl(248, 0x3d))
            }
        }

        return result;
    }

    /**
     * @dev Converts a `uint256` to its ASCII `string` decimal representation.
     */
    function toString(uint256 value) internal pure returns (string memory) {
        // Inspired by OraclizeAPI's implementation - MIT licence
        // https://github.com/oraclize/ethereum-api/blob/b42146b063c7d6ee1358846c198246239e9360e8/oraclizeAPI_0.4.25.sol
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}
