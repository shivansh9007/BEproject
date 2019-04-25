pragma solidity ^0.5.4;

contract SimpleStorage {
  mapping(address => string) publicKey;
  function addPublicKey(string memory key,address a) public {
    bool check = checkPublicKey(a);
    if(check == true)
    {

    }
    else
    {
      publicKey[a] = key;
    }
  }
  function getPublicKey(address a) public view returns (string memory){
    return publicKey[a];
  }
  function checkPublicKey(address a) public view returns (bool) {

    if(bytes(publicKey[a]).length ==0)
    {
      return false;
    }
    else
    {
      return true;
    }
  }

}
