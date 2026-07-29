import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import ChangePasswordForm from "./ChangePasswordForm";
import UserAvatar from "../../components/common/UserAvatar";

function Profile() {
    const {
        user,
        updateUserProfile,
        updateUserAvatar,
    } = useAuth();

    const [name, setName] = useState(user?.name ?? "");

    const [saving, setSaving] = useState(false);
    const [avatarLoading, setAvatarLoading] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        setName(user?.name ?? "");
    }, [user]);

    const handleProfileSubmit = async (event) => {
        event.preventDefault();

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            await updateUserProfile({
                name,
            });

            setSuccess("Profile updated successfully");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to update profile"
            );
        } finally {
            setSaving(false);
        }
    };

    const handleAvatarChange = async (event) => {
        const file = event.target.files[0];

        if (!file) {
            return;
        }

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
        ];

        if (!allowedTypes.includes(file.type)) {
            setSuccess("");
            setError(
                "Only JPG, PNG and WEBP images are allowed"
            );

            event.target.value = "";
            return;
        }

        const maximumSize = 5 * 1024 * 1024;

        if (file.size > maximumSize) {
            setSuccess("");
            setError("Avatar must be smaller than 5 MB");

            event.target.value = "";
            return;
        }

        try {
            setAvatarLoading(true);
            setError("");
            setSuccess("");

            await updateUserAvatar(file);

            setSuccess("Avatar updated successfully");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to upload avatar"
            );
        } finally {
            setAvatarLoading(false);
            event.target.value = "";
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="mx-auto max-w-2xl rounded-xl bg-white p-8 shadow-md">
                <h1 className="mb-8 text-3xl font-bold text-gray-800">
                    My Profile
                </h1>

                <div className="mb-8 flex items-center gap-6">
                    <div className="flex flex-col items-center">
                        <UserAvatar
                            user={user}
                            size="lg"
                        />

                        <label
                            htmlFor="avatar"
                            className={`mt-3 text-sm text-blue-600 ${
                                avatarLoading
                                    ? "cursor-not-allowed opacity-50"
                                    : "cursor-pointer hover:underline"
                            }`}
                        >
                            {avatarLoading
                                ? "Uploading..."
                                : "Change photo"}
                        </label>

                        <input
                            id="avatar"
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleAvatarChange}
                            disabled={avatarLoading}
                            className="hidden"
                        />
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800">
                            {user?.name}
                        </h2>

                        <p className="text-gray-500">
                            {user?.email}
                        </p>

                        <p className="mt-1 text-sm text-gray-400">
                            {user?.role}
                        </p>
                    </div>
                </div>

                {error && (
                    <p className="mb-5 rounded-lg bg-red-100 px-4 py-3 text-red-700">
                        {error}
                    </p>
                )}

                {success && (
                    <p className="mb-5 rounded-lg bg-green-100 px-4 py-3 text-green-700">
                        {success}
                    </p>
                )}

                <form onSubmit={handleProfileSubmit}>
                    <div className="mb-5">
                        <label
                            htmlFor="name"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Name
                        </label>

                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(event) =>
                                setName(event.target.value)
                            }
                            required
                            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="mb-5">
                        <label
                            htmlFor="email"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Email
                        </label>

                        <input
                            id="email"
                            type="email"
                            value={user?.email ?? ""}
                            disabled
                            className="w-full cursor-not-allowed rounded-lg border bg-gray-100 px-3 py-2 text-gray-500"
                        />
                    </div>

                    <div className="mb-6">
                        <label
                            htmlFor="role"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Role
                        </label>

                        <input
                            id="role"
                            type="text"
                            value={user?.role ?? ""}
                            disabled
                            className="w-full cursor-not-allowed rounded-lg border bg-gray-100 px-3 py-2 text-gray-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={saving || avatarLoading}
                        className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {saving
                            ? "Saving..."
                            : "Save Changes"}
                    </button>
                </form>

                <div className="mt-10 border-t pt-8">
                    <ChangePasswordForm />
                </div>
            </div>
        </div>
    );
}

export default Profile;