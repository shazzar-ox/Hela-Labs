// SPDX-License-Identifier: MIT
pragma solidity ~0.8.20;

/**
 * @author <a href="mailto:emmanuelmayowa95@gmail.com">Mayowa</a>
 * @dev contract to vote for fruits,
 */
contract FruitVoting {
    mapping(string fruitnames => uint voteCount) private s_fruitInfo;

    constructor() {}

    //  accepts the name of the fruit and increases vot by one
    function voteForFruit(string memory _fruit) public {
        uint fruitScore = s_fruitInfo[_fruit];
        if (fruitScore <= 0) {
            fruitScore = 1;
        } else {
            fruitScore++;
        }
        s_fruitInfo[_fruit] = fruitScore;
    }

    // function to retun the vote count of a fruit
    function getVotes(string memory _fruit) public view returns (uint) {
        return s_fruitInfo[_fruit];
    }
}
