import React from "react";
import { Card, CardHeader, CardBody, Row, Col, CardTitle } from "reactstrap";
import FormInputs from "components/FormInputs/FormInputs.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import { Form } from "react-bootstrap";
import getWeb3 from "../../utils/getWeb3";
import SimpleStorageContract from "../../contracts/SimpleStorage.json";
import ipfs from "../../utils/ipfs";
import NodeRSA from "../../utils/rsa";
import { async } from "q";
class Transfer extends React.Component {
  state = {
    fileName: 'Select Document'
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
    try {
      sts = await contract.methods.checkPublicKey(event.target.value).call();
      console.log(sts);
      if (sts == true) {
        this.setState({ message: "valid receiver" });
      }
      else {
        this.setState({ message: "Please ask the user to generate KeyPair and try again later" });

      }
    }
    catch (error) {
      console.log("err");
      this.setState({ message: "Enter a valid address" });
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
  onSubmit = async (event) => {
    const { accounts, contract } = this.state;
    event.preventDefault();
    console.log(this.state.buffer.toString());
    const publickey = await contract.methods.getPublicKey(this.state.receiverAddress).call();
    console.log(publickey);
    const key = new NodeRSA();
    key.importKey(publickey, 'public');
    const dataa = key.encrypt(this.state.buffer, 'base64');
    console.log(dataa)
    key.importKey('-----BEGIN RSA PRIVATE KEY----- MIIBPQIBAAJBAMYpZCGuP9b1kmimojo+JTdG6+zJBWM7L6IeyMry2LscHSArZz00 D/hKGE7QQGtd3hX6SxAMc7v8wFdeMcCaNf8CAwEAAQJBAKlEf/jZLEUFHZvxAtA3 d3jBRxPLHqQF0YltPF1HlWQ1fbkSBjJ5yB0mWkrdE4awGcX2qk9MZUlxpFPOec/i WukCIQDl7pKoG9XMypAbS4OSFRfkczT27AYcVqO+wBKp4X12UwIhANygvCY+gwyh 5qQ2ub/WwL+XN6uThkboDYxriFNga/QlAiEAu990y5F630t/9h18kudTT2HnG/78 ezk7sEemuFI7vmsCIQDREUOZ3gzjMJxVqkI0pvU52Lr5TK+mi4kjMlcZ4zoJPQIh AL6HjNDPI3gJwxmMV+ZXZ5uqUJnlNBaaagg7fK4hmstb -----END RSA PRIVATE KEY-----', 'private');
    ipfs.files.add(Buffer.from(dataa), (error, result) => {

      const link = "https://ipfs.io./ipfs/" + result[0].path;
      console.log(link);
      //console.log(key.decrypt(dataa,'utf8'));
      this.setState({ link: link }, this.addData);

      fetch(link)
        .then(
          function (response) {
            if (response.status !== 200) {
              console.log('Looks like there was a problem. Status Code: ' +
                response.status);
              return;
            }

            // Examine the text in the response
            response.text().then(function (data) {
              console.log(data);
              //console.log(key.decrypt(data, 'utf8'));


            });
          }
        )
        .catch(function (err) {
          console.log('Fetch Error :-S', err);
        });
    })
  }

  addData = async () => {
    const { accounts, contract } = this.state;
    console.log("eeee");
    await contract.methods.addData(this.state.link, accounts[0], this.state.receiverAddress).send({ from: accounts[0] });
    console.log("done brp");


  }

  checkKey = async () => {
    const { accounts, contract } = this.state;
    const keyStatus = await contract.methods.checkPublicKey(accounts[0]).call();
    this.setState({ keyStatus: keyStatus })
    console.log(keyStatus);
    const dattt = await contract.methods.getLinks(accounts[0]).call();
    console.log(dattt);



  }

  downloadPrivateKey = async (toDownloadPrivatekey) => {
    const { accounts, contract } = this.state;
    var fileDownload = require('js-file-download');
    fileDownload(toDownloadPrivatekey, accounts[0]+".txt");
  }

  render() {

    if (this.state.keyStatus == 1) {


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
                  {this.state.privateKey ? (
                    <div className="update ml-auto mr-auto">
                      <Button onClick={this.downloadPrivateKey.bind(this, this.state.privateKey)} type="submit" color="primary" round>Download Private Key</Button>
                    </div>

                  ) : ""

                  }

                </CardBody>
              </Card>
            </Col>
          </Row>
        </div >


      );

    }


  }
}

export default Transfer;
