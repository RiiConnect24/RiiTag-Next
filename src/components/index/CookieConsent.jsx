import { Card, Button } from 'react-bootstrap';
import Cookies from 'js-cookie';
import React from 'react';

function getAccepted() {  
    return Cookies.get('accepted');
}

export default class CookieConsent extends React.Component {
    constructor(properties) {
        super(properties);
        this.state = {
            accepted: getAccepted(),
        };

        this.setAccepted = this.setAccepted.bind(this);
    }

    setAccepted() {
        this.setState({
            accepted: true
        });
        Cookies.set('accepted', true, { expires: 365 });
    }

    

    render() {
        const { accepted } = this.state;

        return (
            <Card 
                bg="secondary"
                text="white"
                className="position-fixed"
                style={{
                    visibility: accepted ? 'hidden' : 'visible',
                    bottom: "8%",
                    right: "2%",
                    zIndex: 100,
                }}
            >
                <Card.Body>
                    <Card.Title>
                        Cookies
                    </Card.Title>
                    <Card.Text>
                        This website uses cookies to enhance your experience.
                        <br />
                        By continuing to use this website, you agree to our use of cookies.
                    </Card.Text>
                    <Button variant="primary" onClick={this.setAccepted}>
                        I understand
                    </Button>
                </Card.Body>
            </Card>
        );
    }
}