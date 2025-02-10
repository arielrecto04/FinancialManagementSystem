import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import RequestFormComponent from '@/Components/RequestForm';
import { Head } from '@inertiajs/react';

export default function RequestForm() {
    return (
        <AuthenticatedLayout>
            <Head title="Request Form" />
            <RequestFormComponent />
        </AuthenticatedLayout>
    );
} 