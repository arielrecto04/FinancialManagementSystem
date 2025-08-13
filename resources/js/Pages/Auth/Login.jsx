import { Head, useForm } from "@inertiajs/react";
import InnovatoSSO from "@/Components/InnovatoSSO";

export default function Login({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
        password: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("login"));
    };

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
            <Head title="Log in" />

            <div className="w-full max-w-md">
                <div className="p-8 bg-white rounded-3xl shadow-md">
                    <div className="flex justify-center mb-6">
                        <img
                            src="/images/innovatologo.png"
                            alt="Innovato Logo"
                            className="w-auto h-24"
                        />
                    </div>

                    <div className="mb-8 text-center">
                        <h2 className="text-xl font-semibold text-gray-700">
                            IITS Financial Management System
                        </h2>
                    </div>

                    {status && (
                        <div className="mb-4 text-sm font-medium text-green-600">
                            {status}
                        </div>
                    )}

                    {/* Add SSO Button */}
                    <div className="flex justify-center mb-6 w-full">
                        <InnovatoSSO />
                    </div>

                    <div className="relative mb-6">
                        <div className="flex absolute inset-0 items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="flex relative justify-center text-sm">
                            <span className="px-2 text-gray-500 bg-white">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <form onSubmit={submit}>
                        <div className="mb-6">
                            <input
                                type="text"
                                placeholder="NAME:"
                                className="px-4 py-3 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                            />
                            {errors.email && (
                                <div className="mt-1 text-sm text-red-500">
                                    {errors.email}
                                </div>
                            )}
                        </div>

                        <div className="mb-6">
                            <input
                                type="password"
                                placeholder="PASSWORD:"
                                className="px-4 py-3 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={data.password}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                            />
                            {errors.password && (
                                <div className="mt-1 text-sm text-red-500">
                                    {errors.password}
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className={`w-full py-3 rounded-lg transition duration-200 ${
                                processing
                                    ? "bg-blue-400 cursor-not-allowed"
                                    : "bg-blue-500 hover:bg-blue-600"
                            } text-white`}
                        >
                            {processing ? "LOGGING IN..." : "LOGIN"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
