import { Head, useForm } from '@inertiajs/react';

export default function Login({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <Head title="Log in" />

            <div className="w-full max-w-md">
                <div className="bg-white p-8 rounded-3xl shadow-md">
                    <div className="flex justify-center mb-6">
                        <img 
                            src="/images/innovatologo.png" 
                            alt="Innovato Logo" 
                            className="h-24 w-auto" 
                        />
                    </div>

                    <div className="text-center mb- 8">
                        <h2 className="text-xl font-semibold text-gray-700">
                            IITS Financial Management System
                        </h2>
                    </div>

                    {status && (
                        <div className="mb-4 text-sm font-medium text-green-600">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit}>
                        <div className="mb-6">
                            <input
                                type="text"
                                placeholder="NAME:"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            {errors.email && (
                                <div className="text-red-500 text-sm mt-1">
                                    {errors.email}
                                </div>
                            )}
                        </div>

                        <div className="mb-6">
                            <input
                                type="password"
                                placeholder="PASSWORD:"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            {errors.password && (
                                <div className="text-red-500 text-sm mt-1">
                                    {errors.password}
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className={`w-full py-3 rounded-lg transition duration-200 ${
                                processing 
                                    ? 'bg-blue-400 cursor-not-allowed' 
                                    : 'bg-blue-500 hover:bg-blue-600'
                            } text-white`}
                        >
                            {processing ? 'LOGGING IN...' : 'LOGIN'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
