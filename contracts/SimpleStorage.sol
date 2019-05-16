pragma solidity ^0.5.4;
pragma experimental ABIEncoderV2;

contract SimpleStorage {
  struct Data{
    address from;
    address to;
    
  }
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
  mapping(string=>Data) data;
  function addData(string memory link,address from,address to) public {
      data[link].from=from;
      data[link].to=to;
      addLink(to,link);
  }
  mapping(address=>string[]) addrLink;
  function addLink(address add,string memory link) private{
    addrLink[add].push(link);
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
  function getLinks(address a) public view returns (string[] memory arr)
  {
    arr = addrLink[a];
    return arr;
  }

}
