import React from 'react';
import { Link } from '@inertiajs/react';

export default function Pagination({ links }) {
    if (!links || links.length <= 3) {
        return null;
    }

    return (
        <div className="flex flex-wrap justify-center mt-4">
            <div className="flex flex-wrap -mb-1">
                {links.map((link, key) => {
                    if (!link.url) {
                        return (
                            <span
                                key={key}
                                className="mr-1 mb-1 px-4 py-2 text-sm text-gray-400 border rounded"
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        );
                    }

                    return (
                        <Link
                            key={key}
                            className={`mr-1 mb-1 px-4 py-2 text-sm border rounded focus:outline-none ${
                                link.active
                                    ? 'bg-blue-500 text-white border-blue-500'
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`}
                            href={link.url}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                })}
            </div>
        </div>
    );
} 