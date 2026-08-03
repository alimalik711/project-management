import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    addProjectMember,
    getProjectMembers,
    removeProjectMember,
} from "../../services/projectService";

function ProjectMembers({
    projectId,
    currentUserRole,
}) {
    const [members, setMembers] = useState([]);
    const [email, setEmail] = useState("");

    const [loading, setLoading] = useState(true);
    const [addingMember, setAddingMember] =
        useState(false);

    const [
        removingMemberId,
        setRemovingMemberId,
    ] = useState(null);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const isOwner = currentUserRole === "OWNER";

    const fetchMembers = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const data =
                await getProjectMembers(projectId);

            if (!Array.isArray(data.members)) {
                throw new Error(
                    "Members response is not an array"
                );
            }

            setMembers(data.members);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                    error.message ||
                    "Failed to load project members"
            );
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    useEffect(() => {
        fetchMembers();
    }, [fetchMembers]);

    const handleAddMember = async (event) => {
        event.preventDefault();

        try {
            setAddingMember(true);
            setError("");
            setSuccess("");

            await addProjectMember(projectId, {
                email,
            });

            setEmail("");

            await fetchMembers();

            setSuccess(
                "Member added successfully"
            );
        } catch (error) {
            setError(
                error.response?.data?.message ||
                    "Failed to add member"
            );
        } finally {
            setAddingMember(false);
        }
    };

    const handleRemoveMember = async (
        userId
    ) => {
        try {
            setRemovingMemberId(userId);
            setError("");
            setSuccess("");

            await removeProjectMember(
                projectId,
                userId
            );

            await fetchMembers();

            setSuccess(
                "Member removed successfully"
            );
        } catch (error) {
            setError(
                error.response?.data?.message ||
                    "Failed to remove member"
            );
        } finally {
            setRemovingMemberId(null);
        }
    };

    return (
        <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="mb-5 text-xl font-bold text-gray-800">
                Project Members
            </h2>

            {isOwner && (
                <form
                    onSubmit={handleAddMember}
                    className="mb-6 flex gap-3"
                >
                    <input
                        type="email"
                        value={email}
                        onChange={(event) =>
                            setEmail(
                                event.target.value
                            )
                        }
                        placeholder="Enter member email"
                        required
                        disabled={addingMember}
                        className="flex-1 rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />

                    <button
                        type="submit"
                        disabled={addingMember}
                        className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {addingMember
                            ? "Adding..."
                            : "Add Member"}
                    </button>
                </form>
            )}

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

            {loading ? (
                <p>Loading members...</p>
            ) : members.length === 0 ? (
                <p className="text-gray-500">
                    No members found.
                </p>
            ) : (
                <div className="space-y-4">
                    {members.map((member) => {
                        const memberId =
                            member.user_id ??
                            member.id;

                        const isProjectOwner =
                            member.role ===
                            "OWNER";

                        const isRemoving =
                            removingMemberId ===
                            memberId;

                        return (
                            <div
                                key={memberId}
                                className="flex items-center justify-between border-b pb-4 last:border-b-0"
                            >
                                <div>
                                    <p className="font-medium text-gray-800">
                                        {member.name}
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        {member.email}
                                    </p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                                        {member.role}
                                    </span>

                                    {isOwner &&
                                        !isProjectOwner && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRemoveMember(
                                                        memberId
                                                    )
                                                }
                                                disabled={
                                                    isRemoving
                                                }
                                                className="rounded-lg bg-red-100 px-3 py-1 text-sm text-red-700 hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                {isRemoving
                                                    ? "Removing..."
                                                    : "Remove"}
                                            </button>
                                        )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default ProjectMembers;