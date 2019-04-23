import React from "react";
import { Card, CardHeader, CardBody, Row, Col, CardTitle } from "reactstrap";
import FormInputs from "components/FormInputs/FormInputs.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import { Form } from "react-bootstrap";
class Typography extends React.Component {
  render() {
    return (
      <div className="content">
        <Row>
          <Col xs={12}>
          <Card>
              <CardHeader><CardTitle>Transfer</CardTitle></CardHeader>
              <CardBody>

                                    

              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Typography;
