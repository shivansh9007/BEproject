import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Table,
  Row,
  Col
} from "reactstrap";

import getWeb3 from "../../utils/getWeb3";
import SimpleStorageContract from "../../contracts/SimpleStorage.json";
import { thead, tbody } from "variables/linkTable";
import { async } from "q";
import NodeRSA from "../../utils/rsa";


class RegularTables extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      tbodyc: [],
      privateKetStatus: 'Upload Private Key',
      privateKey: '',
      privateKeyValid: 'false',
      msg: 'Upload a valid private key.'
    };

    this.uploadFile = this.uploadFile.bind(this);
  }

  getLinks = async () => {
    const { accounts, contract } = this.state;

    const tbodyc = await contract.methods.getLinks(accounts[0]).call();
    if (tbodyc) {
      this.setState({ tbodyc: tbodyc });
    }

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
      this.setState({ web3, accounts, contract: instance }, this.getLinks);

      //  
    } catch (error) {
      //   // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.log('called');
    }
  };
  decryptAndDownload = async (links, e) => {
    e.preventDefault();
    const pk = this.state.privateKey;
    const pkstatus = this.state.privateKeyValid;
    fetch(links)
      .then(
        function (response) {
          if (response.status !== 200) {
            console.log('Looks like there was a problem. Status Code: ' +
              response.status);
            return;
          }

          // Examine the text in the response
          response.text().then(function (data) {

            if (pk !== null && pkstatus === true) {
              console.log(data);
              var key = new NodeRSA(pk)
              console.log();
              var fileDownload = require('js-file-download');
              fileDownload(key.decrypt(data, 'utf8'), links + ".txt");

            }


          });
        }
      )
      .catch(function (err) {
        console.log('Fetch Error :-S', err);
      });

  }
  uploadFile(event) {
    // var reader = new window.FileReader();
    // let file = event.target.files[0];
    // console.log(file);

    // // if (file) {
    // //     let data = new FormData();
    // //     data.append('file', file);
    // //     // axios.post('/files', data)...
    // // }
    // reader.readAsText(file);
    // var result = reader.result;
    // console.log(result)
    // this.setState({ privateKey: result })
    // console.log(this.state.privateKey);

    var file = event.target.files[0];
    var reader = new FileReader();
    const self = this
    reader.onload = async (event) => {
      // console.log(event.target.result)
      // var result = event.target.result;
      const { accounts, contract } = this.state;
      self.setState({ privateKey: event.target.result });
      self.setState({ privateKetStatus: 'Uploaded' })
      console.log('private key from file')
      console.log(this.state.privateKey);
      var keyPair = new NodeRSA(this.state.privateKey);

      var keyob = await contract.methods.getPublicKey(accounts[0]).call();
      var keyfpk = keyPair.exportKey('public');
      if (keyob === keyfpk) {
        this.setState({ privateKeyValid: true });
        this.setState({ msg: 'Valid private key' });
      }
      else {
        this.setState({ privateKeyValid: false });
        this.setState({ msg: 'Upload a valid private key. Guessing won\'t work' });
      }

    };

    reader.readAsText(file);
  }



  render() {
    try {
      console.log(tbody);
      console.log(this.state.tbodyc);
    } catch (error) {

    }
    return (
      <div className="content">
        <Row>
          <Col xs={12}>
            <Card>
              <CardHeader>
                <CardTitle tag="h4"> To View Documents, Enter Private Key
                   <h6>
                    <label htmlFor="file-input" className="btn btn-info btn-md">
                      <div style={{ textTransform: 'none' }}>
                        {this.state.privateKetStatus}
                      </div>

                    </label>
                    <input id="file-input" type="file" style={{ display: 'none' }} onChange={this.uploadFile} />
                  </h6>
                  <div>
                    <p>{this.state.msg}</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardBody>
                {/* <Table responsive>
                  <thead className="text-primary">
                    <tr>
                      {thead.map((prop, key) => {
                        if (key === thead.length - 1)
                          return (
                            <th key={key} className="text-right">
                              {prop}
                            </th>
                          );
                        return <th key={key}>{prop}</th>;
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {tbody.map((prop, key) => {
                      return (
                        <tr key={key}>
                          {prop.data.map((prop, key) => {
                            if (key === thead.length - 1)
                              return (
                                <td key={key} className="text-right">
                                  {prop}
                                </td>
                              );
                            return <td key={key}>{prop}</td>;
                          })}
                        </tr>
                      );
                    })}

                  </tbody>
                </Table> */}

                <Table responsive>
                  <thead className="text-primary">
                    <tr>
                      {thead.map((prop, key) => {
                        if (key === thead.length - 1)
                          return (
                            <th key={key} className="text-center">
                              {prop}
                            </th>
                          );
                        return <th key={key}>{prop}</th>;
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {
                      this.state.tbodyc.map((links, key) => {
                        return (
                          <tr key={key}>
                            <td key={key} className="text-left">
                              {links}
                            </td>
                            <td className="text-center">
                              <a href="#" onClick={(e) => this.decryptAndDownload(links, e)}   >
                                Download
                              </a>
                            </td>
                            <td className="text-center">
                              <a href={links} target="_blank">
                                View
                              </a>
                            </td>
                          </tr>
                        );

                      })
                    }

                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>

        </Row>
      </div>
    );
  }
}

export default RegularTables;
