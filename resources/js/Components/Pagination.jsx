import React from 'react';
import { Link } from '@inertiajs/react';

export default function Pagination({ links }) {
    if (!links || links.length < 2) return null;

    return (
        <div className="flex flex-wrap justify-center gap-1">
            {links.map((link, key) => {
                return link.url === null ? (
                    <span
                        key={key}
                        className="px-4 py-2 text-sm border rounded text-gray-500"
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ) : (
                    <Link
                        key={key}
                        href={link.url}
                        className={`px-4 py-2 text-sm border rounded hover:bg-gray-50 ${
                            link.active ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                );
            })}
        </div>
    );
} 