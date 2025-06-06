import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import RequestFormComponent from '@/Components/RequestForm';
import { Head } from '@inertiajs/react';

export default function RequestForm({ auth, errors, type }) {
    return (
        <AuthenticatedLayout>
            <Head title="Request Form" />
            <RequestFormComponent auth={auth} errors={errors} type={type} />
        </AuthenticatedLayout>
    );
} 