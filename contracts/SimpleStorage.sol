pragma solidity ^0.5.0;

contract SimpleStorage {
    struct data
    {
        string link;
        address from;
    }
    mapping(address => data) public storeddata;
    address[] public receiver;
    mapping(address => string) public key;
    function set(string  memory x,address z) public {
        receiver.push(z)-1;
        storeddata[z].link = x;
        storeddata[z].from = msg.sender;
    }
    function writePublicKey(address a,string memory Pkey) public{
        key[a] = Pkey;

    }
    function getPublicKey(address a) public view returns (string memory)
    {
        if(bytes(key[a]).length == 0)
        {
            return "empty";
        }
        else{
            return key[a];
        }
       
    }
    function getstoreddata(address a) public view returns (string memory)  {
        return storeddata[a].link;
        
    }
}
