import { toast } from 'react-toastify';
import { Button } from 'react-bootstrap';

export default function RefreshTagButton() {
    const refresh = async () => {
        const response = await fetch('/api/account/refresh-tag', {
            method: 'GET',
        });

        if (response.status === 200) {
            toast.success('Tag refreshed!');
        } else {
            toast.error('An error occured, please try again later.');
        }
    }

    return (
        <>
            <Button variant="success" onClick={refresh}>
                Refresh Your Tag
            </Button>
        </>
    )
}