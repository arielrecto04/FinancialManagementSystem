export default function TypingIndicator({ user }) {
    // If no user is passed in the props, render nothing.
    if (!user) {
        return null;
    }

    return (
        <div className="flex items-center p-2 space-x-2 text-sm italic text-gray-500">
            <img
                src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
                alt={user.name}
                className="w-6 h-6 rounded-full"
            />
            <span>{user.name} is typing...</span>
            {/* Optional: Add a pulsing dot animation */}
            <span className="flex w-2 h-2">
                <span className="inline-flex absolute w-full h-full bg-blue-400 rounded-full opacity-75 animate-ping"></span>
                <span className="inline-flex relative w-2 h-2 bg-blue-500 rounded-full"></span>
            </span>
        </div>
    );
}
