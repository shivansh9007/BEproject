import React from "react";
import { Card, CardHeader, CardBody, Row, Col, CardTitle } from "reactstrap";
import FormInputs from "components/FormInputs/FormInputs.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import { Form } from "react-bootstrap";
import getWeb3 from "../../utils/getWeb3";
import SimpleStorageContract from "../../contracts/SimpleStorage.json";
import ipfs from "../../utils/ipfs";
import NodeRSA from "../../utils/rsa";
class Typography extends React.Component {
  state={
    fileName:'Select Document'
  }
  componentDidMount = async () => {
    try {
        //   // Get network provider and web3 instance.
        const web3 = await getWeb3();
        console.log('idhar hich hai apun');
        //   // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();
        console.log(accounts)
        const networkId = await web3.eth.net.getId();
        console.log(networkId);
        const deployedNetwork = SimpleStorageContract.networks[networkId];
        const instance = new web3.eth.Contract(
            SimpleStorageContract.abi,
            deployedNetwork && deployedNetwork.address,
        );
        console.log(instance);
        //   // Set web3, accounts, and contract to the state, and then proceed with an
        //   // example of interacting with the contract's methods.
        this.setState({ web3, accounts, contract: instance }, this.checkKey);

        //  
    } catch (error) {
        //   // Catch any errors for any of the above operations.
        alert(
            `Failed to load web3, accounts, or contract. Check console for details.`,
        );
        console.log('called');
    }
};
captureFile = (event) => {
  event.stopPropagation()
  event.preventDefault()
  const file = event.target.files[0]
  let reader = new window.FileReader()

  //size of file
  this.setState({ fileSize: event.target.files[0].size })
  this.setState({ fileName: event.target.files[0].name })
  this.setState({ fileType: event.target.files[0].type })
  this.setState({ fileExt: event.target.files[0].name.split('.').pop() })
  reader.readAsArrayBuffer(file)
  reader.onloadend = () => this.convertToBuffer(reader)


};
onSubmitGenerate = async (event) => {
  event.preventDefault();
  const { accounts, contract } = this.state;
  console.log("here")
  if (this.state.keyStatus == false) {
      var keypair = new NodeRSA({ b: 512 });

     
      this.setState({ privateKey: keypair.exportKey('private') });
      console.log(keypair.exportKey('public'));
      console.log(this.state.privateKey); 

      await contract.methods.addPublicKey(keypair.exportKey('public'), accounts[0]).send({ from: accounts[0] });
      
      // var cipherKey = CryptoJS.AES.encrypt(this.state.privateKey, this.state.password);
      // console.log(cipherKey);
      
  }


}
getReceiversAddress = async (event) => {
  event.preventDefault();
  const { accounts, contract } = this.state;

  this.setState({ receiverAddress: event.target.value });
  console.log(this.state.receiverAddress);
  var sts;
  try{
    sts = await contract.methods.checkPublicKey(this.state.receiverAddress).call();
    console.log(sts);
    if(sts == false)
  {
    this.setState({message:"Please ask the user to generate KeyPair or else the check the Receivers Address"});
  }
  else
    this.setState({message:""});  
  } 
  catch(error){
    console.log("err");
    //this.setState({message:"Please ask the user to generate KeyPair or else the check the Receivers Address"});
  }
  
  console.log(sts);
  
    
  


  //console.log(this.state.message)  
}

convertToBuffer = async (reader) => {
  //file is converted to a buffer to prepare for uploading to IPFS
  const buffer = await Buffer.from(reader.result);
  //set this buffer -using es6 syntax
  this.setState({ buffer });
  //console.log(this.state.buffer.toString());

};
  onSubmit = async(event) =>
  {
    event.preventDefault();
    
  }
  
checkKey = async () => {
  const { accounts, contract } = this.state;
  const keyStatus = await contract.methods.checkPublicKey(accounts[0]).call();
  this.setState({ keyStatus: keyStatus })
  console.log(keyStatus);



}

  render() {
    if (this.state.keyStatus == 1){

    
    return (
      <div className="content">
        <Row>
          <Col xs={12}>
          <Card>
              <CardHeader><CardTitle>Transfer</CardTitle></CardHeader>
              <CardBody>
              <form onSubmit={this.onSubmit}>
              <div>
                <label htmlFor="file-input" className="btn btn-info btn-md">
                                                <div style={{ textTransform: 'none' }}>
                                                    {this.state.fileName}
                                                </div>

                                            </label>
                                            <input id="file-input" type="file" style={{ display: 'none' }} onChange={this.captureFile} />
                                        </div>
                                        <FormInputs
                                            ncols={["col-md-6 pr-1"]}
                                            proprieties={[
                                                {
                                                    label: "Receivers Address",
                                                    inputProps: {
                                                        type: "textarea",
                                                        defaultValue:
                                                            "",
                                                        placeholder: "Enter Receivers Address",
                                                        onChange: this.getReceiversAddress
                                                    }
                                                }
                                            ]}
                                        />
                                        <Row>
                                            <div className="update ml-auto mr-auto">
                                          <h2>
                                          {this.state.message}
                                            </h2> 
                                      
                               
                                            </div>
                                        </Row>

                                        <Row>
                                            <div className="update ml-auto mr-auto">
                                                <Button type="submit" color="primary" round>Transfer Securely</Button>
                                            </div>
                                        </Row>
                                         </form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
    }
    else {
      return (
          <div className="content">
              <Row>
                  <Col xs={12}>

                      <Card>
                          <CardHeader><CardTitle>Generate</CardTitle></CardHeader>
                          <CardBody>
                              <h6>You haven't Generated a KeyPair yet</h6>
                              <form onSubmit={this.onSubmitGenerate}>
                                  <Button type='submit' color='primary' round>Generate keypair</Button>
                              </form>
                              <h1></h1>
                              <blockquote>
                                  <p className="blockquote blockquote-primary">
                                      {this.state.privateKey}
                                  </p>
                              </blockquote>
                          </CardBody>
                      </Card>
                  </Col>
              </Row>
          </div >


      );

  }
    
                                          
  }
}

export default Typography;
