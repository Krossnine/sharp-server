import React from 'react';
import { Container, Navbar as BootstrapNavbar} from 'react-bootstrap';

export default function Navbar() {
    return (
        <BootstrapNavbar bg="dark" variant="dark">
            <Container>
                <BootstrapNavbar.Brand>
                    <img
                        alt=""
                        src="logo.png"
                        width="30"
                        height="30"
                        className="d-inline-block align-top"
                        style={{marginRight: "0.5rem"}}
                    />{' '}
                    Sharp Server
                </BootstrapNavbar.Brand>
            </Container>
        </BootstrapNavbar>
    );
}

