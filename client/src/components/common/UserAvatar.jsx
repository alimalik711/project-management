function UserAvatar({
    user,
    size = "md"
}) {
    const avatarUrl = user?.avatar
        ? `http://localhost:5000/${user.avatar}`
        : null;

    const sizeClasses = {
        sm: "h-8 w-8 text-sm",
        md: "h-10 w-10 text-base",
        lg: "h-24 w-24 text-3xl",
    };

    const selectedSize =
        sizeClasses[size] ?? sizeClasses.md;

    if (avatarUrl) {
        return (
            <img
                src={avatarUrl}
                alt={`${user?.name ?? "User"} avatar`}
                className={`${selectedSize} rounded-full border object-cover`}
            />
        );
    }

    return (
        <div
            className={`${selectedSize} flex items-center justify-center rounded-full bg-blue-600 font-bold text-white`}
        >
            {user?.name
                ?.charAt(0)
                .toUpperCase() || "U"}
        </div>
    );
}

export default UserAvatar;