import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./utils/getWeb3";
import ipfs from'./ipfs'
import "./App.css";
import keypair from 'generate-rsa-keypair'
import fs from './fs'
import { RSA_NO_PADDING } from "constants";
import NodeRSA from './rsa';
import { FilePond } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
let key = new NodeRSA({b:512});
let ra;
class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null };
  

  componentDidMount = async () => {
     try {
    //   // Get network provider and web3 instance.
       const web3 = await getWeb3();
        console.log('idhar hich hai apun');
    //   // Use web3 to get the user's accounts.
       const accounts = await web3.eth.getAccounts();

      const networkId = await web3.eth.net.getId();
      console.log(networkId);
       const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
         SimpleStorageContract.abi,
         deployedNetwork && deployedNetwork.address,
      );
      
    //   // Set web3, accounts, and contract to the state, and then proceed with an
    //   // example of interacting with the contract's methods.
       this.setState({ web3, accounts, contract: instance },this.checkKey);
       
      //  
     } catch (error) {
    //   // Catch any errors for any of the above operations.
    alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
    console.log('called');
    }
    
    
  };
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.captureFile = this.captureFile.bind(this);
    this.checkKey = this.checkKey.bind(this);
    this.getAddress = this.getAddress.bind(this);
    //var Matts= keypair();
    //console.log(Matts.private);
    //console.log(key);
  
    this.state = {
      buffer:null
    }
    
  }
  
  captureFile(event){
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    ///console.log(reader);
    reader.onloadend = () => {
      this.setState({buffer : Buffer(reader.result)})
      //console.log(this.state.buffer);
      //console.log(key.encrypt(this.state.buffer,'base64'));
    }
  }
  getAddress(event){
    event.preventDefault();
     ra = event.target.value;
    console.log(ra);
    //this.setState({ReceiversAddress : ra});
    //console.log(this.state.ReceiversAddress);
  }
  onSubmit = async(event) =>  {
    
    event.preventDefault()
    const {contract} = this.state
    const rk = await contract.methods.getPublicKey(ra).call();
    console.log(rk);
    key.importKey(rk,'public');
    const dataa = key.encrypt(this.state.buffer,'base64')
    const publickey = key.exportKey('public');
    console.log(publickey.toString());
    console.log(publickey);
    key.importKey('-----BEGIN RSA PRIVATE KEY----- MIIBOQIBAAJBAIssxwlOUAXRyuusS15J8LJtJKSVhMKL+kfk+ZlfkbXOshYv5jlR hB/QtecefVERJJwmG+7rx/6DHEabgDOPBJECAwEAAQJAM44JyPu2jwFRDw5K+Qmg 3SerHEC65ipeM0Wx5EvPuS3lCgWtRPMNY2+iNvBiMKU9xAffbliZEI0dx5r4enZV sQIhAMmmotl+0ojsQ+qwXXZg/+rIRrtlimM5qfcrTcR/b7sVAiEAsK93i6QbDbv4 SvXFCGc4hcpoMW4USNgkwmXxianHko0CIDCIL3eDI26a1nm8erIMBGvgSc2+UYEy FqsLPAtH1H9FAiBoPU1xREN1yeVGDFPPjl5piK4KI6CyDVs6mbxz9Ie67QIgB90P hYgRGJTpdlCrbRxLOyfIrfBnu3+u4KAjatTGWgg= -----END RSA PRIVATE KEY-----','private')
    const decrypt = key.decrypt(dataa,'utf8');
    //const publickey = key.exportKey('public');
   
    //fs.writeFile('./data.txt', key , 'utf-8');
    const privatekk = key.exportKey('private');
    console.log(privatekk.toString());
    console.log(publickey);

    
    console.log(Buffer.from(dataa));
    ipfs.files.add(Buffer.from(dataa),(error,result)=>{
     
      const link = "https://ipfs.io./ipfs/"+result[0].path;
      //console.log(link);
      //console.log(key.decrypt(dataa,'utf8'));
      this.setState({link : link},this.runExample);
      
      fetch(link)
  .then(
    function(response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
          response.status);
        return;
      }

      // Examine the text in the response
      response.text().then(function(data) {
        console.log(data);
        const pkkk = key.exportKey('private');
        console.log(pkkk.toString());
        const dataaaa = key.decrypt(data,'utf8');
        console.log(dataaaa);

      });
    }
  )
  .catch(function(err) {
    console.log('Fetch Error :-S', err);
  });
    })
    console.log('clicked');
  }
  checkKey = async () => {
    const { accounts, contract } = this.state;

    const selfkey = await contract.methods.getPublicKey(accounts[0]).call();
     console.log(selfkey)
       if(selfkey === 'empty')
       {
    key = new NodeRSA({b:512});
    let kkk=key.exportKey('public')
    console.log(kkk)
       await contract.methods.writePublicKey(accounts[0],kkk).send({from:accounts[0]
        });
       this.setState({privatekey : key.exportKey('private')});
       console.log(this.state.privatekey);
       }
       this.setState({acc:accounts[0]})
       const link = await contract.methods.getstoreddata(this.state.acc);
       console.log(link);
       const response = await contract.methods.getstoreddata(accounts[0]).call();
    
       // Update state with the result.
        this.setState({ storageValue: response });
       console.log(this.state.storageValue);
  }

  runExample = async () => {
    const { accounts, contract } = this.state;
    console.log(this.state.privatekey);
    console.log(this.state.link);
    await contract.methods.set(this.state.link,ra).send({ from: accounts[0] });

    
   
  };

  render() {
   
    return (
      <div className="App">
        <h1>IPFS file uploader</h1>
        {this.state.result}

        <form onSubmit={this.onSubmit}>
        <h1>{this.state.response}</h1>
        <input type='file' onChange={this.captureFile}/>
        <input type='submit' value='Submit'/>
        <div>
        <input type ="text" name={this.state.value} onChange={this.getAddress}/>
        </div>
        <FilePond/>
        </form>
        <h3>{this.state.privatekey}</h3>
        <h3>{this.state.storageValue}</h3>
      </div>
    );
  }
}

export default App;
