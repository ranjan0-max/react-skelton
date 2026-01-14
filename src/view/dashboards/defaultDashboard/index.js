import { Heading } from 'rsuite';
import { fontFamily } from 'constant/constant';

export default function DefaultDashboard() {
    return (
        <Heading style={{ fontFamily: fontFamily, textAlign: 'center' }}>
            Welcome to Admin Dashboard
        </Heading>
    );
}
