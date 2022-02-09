import { Card, Button } from 'react-bootstrap';
import Cookies from 'js-cookie';
import React from 'react';

export default function CookieConsent() {
    const [accepted, setAccepted] = React.useState(Cookies.get("accepted") === "true");

    const onClick = () => {
        setAccepted(true);
        Cookies.set('accepted', true);
    }

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
                <Button variant="primary" onClick={onClick}>
                    I understand
                </Button>
            </Card.Body>
        </Card>
    );
}