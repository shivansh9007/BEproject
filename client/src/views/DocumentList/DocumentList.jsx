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


class RegularTables extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            tbodyc: [],
            privateKetStatus: 'Upload Private Key',
            privateKey: ''
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
            self.setState({ privateKey: event.target.result });
            self.setState({ privateKetStatus: 'Uploaded' })
            console.log('private key from file')
            console.log(this.state.privateKey);

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
                                                            <a href={links} download >
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
