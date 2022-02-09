import { toast } from 'react-toastify';
import { Button } from 'react-bootstrap';

async function refresh() {
    const response = await fetch('/api/account/refresh-tag', {
        method: 'POST',
    });

    if (response.status === 200) {
        toast.success('Tag refreshed!');
    } else {
        toast.error('An error occured, please try again later.');
    }
}

export default function RefreshTagButton() {
    return (
        <Button variant="success" onClick={refresh}>
            Refresh Your Tag
        </Button>
    )
}