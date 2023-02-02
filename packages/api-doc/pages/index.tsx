import Head from 'next/head'

import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


import ImageForm from "../components/image-form/ImageForm";

export default function Home() {
  return (
      <>
        <Head>
          <title>Sharp Server documentation</title>
          <meta name="description" content="Sharp server documentation" />
          <link rel="icon" href="/home/krossnine/Work/sharp-server/source/packages/api-doc/public/favicon.ico" />
        </Head>
        <Container fluid={true}>
          <Row>
            <Col>
              <ImageForm />
            </Col>
          </Row>
        </Container>
      </>
  );
}
