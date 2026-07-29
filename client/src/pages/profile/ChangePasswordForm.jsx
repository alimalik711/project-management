import { useState } from "react";
import { changePassword } from "../../services/authService";

function ChangePasswordForm() {
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (
            formData.newPassword !==
            formData.confirmPassword
        ) {
            setError("New passwords do not match");
            return;
        }

        try {
            setSaving(true);

            await changePassword({
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
            });

            setSuccess("Password changed successfully");

            setFormData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to change password"
            );

        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="mt-8 border-t pt-8">

            <h2 className="text-2xl font-semibold text-gray-800 mb-5">
                Change Password
            </h2>

            {error && (
                <p className="mb-4 text-red-600">
                    {error}
                </p>
            )}

            {success && (
                <p className="mb-4 text-green-600">
                    {success}
                </p>
            )}

            <form onSubmit={handleSubmit}>

                <div className="mb-4">

                    <label
                        htmlFor="currentPassword"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Current Password
                    </label>

                    <input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        required
                        className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    />

                </div>

                <div className="mb-4">

                    <label
                        htmlFor="newPassword"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        New Password
                    </label>

                    <input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={formData.newPassword}
                        onChange={handleChange}
                        required
                        minLength={6}
                        className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    />

                </div>

                <div className="mb-6">

                    <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Confirm New Password
                    </label>

                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        minLength={6}
                        className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    />

                </div>

                <button
                    type="submit"
                    disabled={saving}
                    className="bg-gray-800 text-white px-5 py-2 rounded-lg hover:bg-gray-900 disabled:opacity-50"
                >
                    {saving
                        ? "Changing..."
                        : "Change Password"}
                </button>

            </form>

        </div>
    );
}

export default ChangePasswordForm;