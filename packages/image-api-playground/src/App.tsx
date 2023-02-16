import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ImageForm from "./components/image-form/ImageForm";
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from "./components/navbar/Navbar";

function App() {
    return (
        <>
            <Navbar />
            <Container>
                <Row>
                    <Col>
                        <ImageForm/>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default App;
