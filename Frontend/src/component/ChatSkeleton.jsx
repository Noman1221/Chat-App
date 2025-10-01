import Skeleton from "react-loading-skeleton";

function ChatSkeleton() {
    return (
        <div className="p-4">
            {/* Top bar */}
            <div className="flex items-center space-x-3 mb-4">
                <Skeleton circle width={40} height={40} />
                <Skeleton width={120} height={20} />
            </div>

            {/* Messages */}
            <div className="space-y-3">
                <Skeleton width="60%" height={20} />
                <Skeleton width="40%" height={20} />
                <Skeleton width="70%" height={20} />
            </div>

            {/* Input box */}
            <div className="mt-6">
                <Skeleton height={40} />
            </div>
        </div>
    );
}

export default ChatSkeleton;
