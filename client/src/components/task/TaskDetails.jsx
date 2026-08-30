import { useEffect, useState, useCallback } from "react";
import {
    Link,
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    assignTask,
    deleteTask,
    getTaskById,
    changeTaskStatus,
} from "../../services/taskService";

import {
    getProjectMembers,
} from "../../services/projectService";

import {
    getTaskComments,
    createComment,
    updateComment,
    deleteComment,
} from "../../services/commentService";

import {
    getTaskFiles,
    uploadFile,
    deleteFile,
} from "../../services/fileService";

import EditTaskForm from "../../components/task/EditTaskForm";

function TaskDetails() {
    const { taskId } = useParams();
    const navigate = useNavigate();

    // Main task
    const [task, setTask] = useState(null);

    // Project members
    const [members, setMembers] = useState([]);

    // Selected member for assignment
    const [selectedUserId, setSelectedUserId] = useState("");

    // Comments state
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingCommentText, setEditingCommentText] = useState("");

    // Files state
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadingFile, setUploadingFile] = useState(false);

    // Loading & action states
    const [loading, setLoading] = useState(true);
    const [assigning, setAssigning] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [changingStatus, setChangingStatus] = useState(false);
    const [submittingComment, setSubmittingComment] = useState(false);

    // Edit task form modal
    const [showEditForm, setShowEditForm] = useState(false);

    // Messages
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const fetchTask = useCallback(async () => {
        try {
            setError("");
            const data = await getTaskById(taskId);
            if (!data.task) {
                throw new Error("Task data was not returned");
            }
            setTask(data.task);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.message ||
                "Failed to load task"
            );
        }
    }, [taskId]);

    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true);
            await fetchTask();
            setLoading(false);
        };
        if (taskId) {
            loadInitialData();
        }
    }, [taskId, fetchTask]);

    // Fetch members, comments, and files once task is loaded
    useEffect(() => {
        if (!task?.project_id) return;

        const loadRelatedData = async () => {
            try {
                const membersData = await getProjectMembers(task.project_id);
                if (Array.isArray(membersData.members)) {
                    setMembers(membersData.members);
                }

                const commentsData = await getTaskComments(taskId);
                setComments(Array.isArray(commentsData) ? commentsData : commentsData.comments || []);

                const filesData = await getTaskFiles(taskId);
                setFiles(Array.isArray(filesData.files) ? filesData.files : Array.isArray(filesData) ? filesData : []);
            } catch (err) {
                console.error("Error loading related task data:", err);
            }
        };

        loadRelatedData();
    }, [task?.project_id, taskId]);

    const handleTaskUpdated = (updatedTask) => {
        setTask((prev) => ({ ...prev, ...updatedTask }));
        setError("");
        setSuccess("Task updated successfully");
    };

    const handleAssignTask = async () => {
        if (!selectedUserId) {
            setError("Please select a member");
            return;
        }

        try {
            setAssigning(true);
            setError("");
            setSuccess("");

            // Send object { userId: Number(selectedUserId) }
            await assignTask(taskId, {
                userId: Number(selectedUserId),
            });

            setSuccess("Task assigned successfully");
            setSelectedUserId("");
            await fetchTask();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.message ||
                "Failed to assign task"
            );
        } finally {
            setAssigning(false);
        }
    };

    const handleChangeStatus = async (newStatus) => {
        try {
            setChangingStatus(true);
            setError("");
            setSuccess("");

            const response = await changeTaskStatus(taskId, { status: newStatus });
            setTask((prev) => ({
                ...prev,
                status: response.task?.status || newStatus,
            }));
            setSuccess(`Status changed to ${newStatus}`);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.message ||
                "Failed to update task status"
            );
        } finally {
            setChangingStatus(false);
        }
    };

    const handleDeleteTask = async () => {
        if (!window.confirm("Are you sure you want to delete this task?")) {
            return;
        }

        try {
            setDeleting(true);
            setError("");
            setSuccess("");

            await deleteTask(taskId);
            navigate("/tasks");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.message ||
                "Failed to delete task"
            );
        } finally {
            setDeleting(false);
        }
    };

    // Comment handlers
    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            setSubmittingComment(true);
            setError("");
            await createComment(taskId, { content: newComment });
            setNewComment("");

            const updatedComments = await getTaskComments(taskId);
            setComments(Array.isArray(updatedComments) ? updatedComments : updatedComments.comments || []);
            setSuccess("Comment added successfully");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to add comment");
        } finally {
            setSubmittingComment(false);
        }
    };

    const handleSaveEditedComment = async (commentId) => {
        if (!editingCommentText.trim()) return;

        try {
            setError("");
            await updateComment(commentId, { content: editingCommentText });
            setEditingCommentId(null);
            setEditingCommentText("");

            const updatedComments = await getTaskComments(taskId);
            setComments(Array.isArray(updatedComments) ? updatedComments : updatedComments.comments || []);
            setSuccess("Comment updated successfully");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update comment");
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm("Are you sure you want to delete this comment?")) return;

        try {
            setError("");
            await deleteComment(commentId);

            const updatedComments = await getTaskComments(taskId);
            setComments(Array.isArray(updatedComments) ? updatedComments : updatedComments.comments || []);
            setSuccess("Comment deleted successfully");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete comment");
        }
    };

    // File handlers
    const handleFileUpload = async (e) => {
        e.preventDefault();
        if (!selectedFile) return;

        try {
            setUploadingFile(true);
            setError("");

            const formData = new FormData();
            formData.append("file", selectedFile);

            await uploadFile(taskId, formData);
            setSelectedFile(null);

            const filesData = await getTaskFiles(taskId);
            setFiles(Array.isArray(filesData.files) ? filesData.files : Array.isArray(filesData) ? filesData : []);
            setSuccess("File uploaded successfully");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to upload file");
        } finally {
            setUploadingFile(false);
        }
    };

    const handleDeleteFile = async (fileId) => {
        if (!window.confirm("Are you sure you want to delete this file?")) return;

        try {
            setError("");
            await deleteFile(fileId);

            const filesData = await getTaskFiles(taskId);
            setFiles(Array.isArray(filesData.files) ? filesData.files : Array.isArray(filesData) ? filesData : []);
            setSuccess("File deleted successfully");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete file");
        }
    };

    if (loading) {
        return (
            <div className="p-8">
                <p className="text-gray-500">Loading task...</p>
            </div>
        );
    }

    if (!task) {
        return (
            <div className="p-8">
                {error ? (
                    <p className="text-red-600">{error}</p>
                ) : (
                    <p className="text-gray-500">Task not found.</p>
                )}
            </div>
        );
    }

    // Available unassigned members
    const unassignedMembers = members.filter((member) => {
        const mId = Number(member.user_id ?? member.id);
        return !task.assigned_users?.some((au) => Number(au.id) === mId);
    });

    return (
        <div className="p-8">
            <Link
                to="/tasks"
                className="mb-6 inline-block text-blue-600 hover:underline"
            >
                ← Back to Tasks
            </Link>

            {error && (
                <p className="mb-6 rounded-lg bg-red-100 px-4 py-3 text-red-700">
                    {error}
                </p>
            )}

            {success && (
                <p className="mb-6 rounded-lg bg-green-100 px-4 py-3 text-green-700">
                    {success}
                </p>
            )}

            {/* Task Main Card */}
            <div className="rounded-xl bg-white p-6 shadow">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            {task.title}
                        </h1>

                        <p className="mt-2 text-gray-500">
                            {task.description || "No description"}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <label htmlFor="statusSelect" className="text-sm font-medium text-gray-700">
                            Status:
                        </label>
                        <select
                            id="statusSelect"
                            value={task.status}
                            disabled={changingStatus}
                            onChange={(e) => handleChangeStatus(e.target.value)}
                            className="rounded-lg border px-3 py-1.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="TODO">TODO</option>
                            <option value="IN_PROGRESS">IN_PROGRESS</option>
                            <option value="COMPLETED">COMPLETED</option>
                        </select>
                    </div>
                </div>

                <div className="mt-8 space-y-3 border-t pt-6">
                    <p>
                        <strong>Priority:</strong>{" "}
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                            task.priority === "HIGH" ? "bg-red-100 text-red-700" :
                            task.priority === "MEDIUM" ? "bg-yellow-100 text-yellow-700" :
                            "bg-gray-100 text-gray-700"
                        }`}>
                            {task.priority}
                        </span>
                    </p>

                    <p>
                        <strong>Due date:</strong>{" "}
                        {task.due_date
                            ? new Date(task.due_date).toLocaleDateString()
                            : "No due date"}
                    </p>

                    <p>
                        <strong>Created by:</strong> {task.creator_name || "Unknown"}
                    </p>

                    <p>
                        <strong>Created:</strong>{" "}
                        {task.created_at
                            ? new Date(task.created_at).toLocaleDateString()
                            : "Unknown"}
                    </p>

                    {/* Assigned Users list */}
                    <div className="pt-2">
                        <strong className="block text-sm font-medium text-gray-700 mb-2">
                            Assigned Users:
                        </strong>
                        {task.assigned_users && task.assigned_users.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {task.assigned_users.map((au) => (
                                    <span
                                        key={au.id}
                                        className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-medium text-blue-700"
                                    >
                                        {au.name} ({au.email})
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">No users assigned yet</p>
                        )}
                    </div>
                </div>

                {/* Assign Task Section */}
                <div className="mt-8 border-t pt-6">
                    <h2 className="mb-3 text-lg font-semibold text-gray-800">
                        Assign Task
                    </h2>

                    <div className="flex flex-wrap gap-3">
                        <select
                            value={selectedUserId}
                            onChange={(e) => setSelectedUserId(e.target.value)}
                            className="rounded-lg border px-3 py-2 text-sm outline-none"
                        >
                            <option value="">Select member</option>
                            {unassignedMembers.map((member) => {
                                const memberId = member.user_id ?? member.id;
                                return (
                                    <option key={memberId} value={memberId}>
                                        {member.name} ({member.email})
                                    </option>
                                );
                            })}
                        </select>

                        <button
                            type="button"
                            onClick={handleAssignTask}
                            disabled={assigning || !selectedUserId}
                            className="rounded-lg bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700 disabled:opacity-50"
                        >
                            {assigning ? "Assigning..." : "Assign"}
                        </button>
                    </div>
                </div>

                {/* Edit / Delete Buttons */}
                <div className="mt-8 flex gap-3 border-t pt-6">
                    <button
                        type="button"
                        onClick={() => {
                            setError("");
                            setSuccess("");
                            setShowEditForm(true);
                        }}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                        Edit Task
                    </button>

                    <button
                        type="button"
                        onClick={handleDeleteTask}
                        disabled={deleting}
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                    >
                        {deleting ? "Deleting..." : "Delete Task"}
                    </button>
                </div>
            </div>

            {/* Comments Section */}
            <div className="mt-8 rounded-xl bg-white p-6 shadow">
                <h2 className="mb-4 text-xl font-bold text-gray-800">Comments</h2>

                <form onSubmit={handleAddComment} className="mb-6 flex gap-3">
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        className="flex-1 rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        disabled={submittingComment || !newComment.trim()}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        {submittingComment ? "Posting..." : "Post Comment"}
                    </button>
                </form>

                {comments.length === 0 ? (
                    <p className="text-sm text-gray-500">No comments yet.</p>
                ) : (
                    <div className="space-y-4">
                        {comments.map((comment) => (
                            <div key={comment.id} className="rounded-lg border p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-sm text-gray-800">
                                            {comment.name}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            {comment.created_at
                                                ? new Date(comment.created_at).toLocaleString()
                                                : ""}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditingCommentId(comment.id);
                                                setEditingCommentText(comment.content);
                                            }}
                                            className="text-blue-600 hover:underline"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteComment(comment.id)}
                                            className="text-red-600 hover:underline"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>

                                {editingCommentId === comment.id ? (
                                    <div className="flex gap-2 mt-2">
                                        <input
                                            type="text"
                                            value={editingCommentText}
                                            onChange={(e) => setEditingCommentText(e.target.value)}
                                            className="flex-1 rounded border px-2 py-1 text-sm"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleSaveEditedComment(comment.id)}
                                            className="rounded bg-green-600 px-3 py-1 text-xs text-white"
                                        >
                                            Save
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setEditingCommentId(null)}
                                            className="rounded bg-gray-300 px-3 py-1 text-xs text-gray-700"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-700">{comment.content}</p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* File Attachments Section */}
            <div className="mt-8 rounded-xl bg-white p-6 shadow">
                <h2 className="mb-4 text-xl font-bold text-gray-800">File Attachments</h2>

                <form onSubmit={handleFileUpload} className="mb-6 flex flex-wrap gap-3 items-center">
                    <input
                        type="file"
                        onChange={(e) => setSelectedFile(e.target.files[0])}
                        className="text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <button
                        type="submit"
                        disabled={uploadingFile || !selectedFile}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        {uploadingFile ? "Uploading..." : "Upload File"}
                    </button>
                </form>

                {files.length === 0 ? (
                    <p className="text-sm text-gray-500">No file attachments yet.</p>
                ) : (
                    <div className="space-y-3">
                        {files.map((file) => (
                            <div key={file.id} className="flex items-center justify-between rounded-lg border p-3">
                                <div className="flex items-center gap-3">
                                    <span className="font-medium text-sm text-gray-800">
                                        {file.original_name || file.filename}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        ({Math.round((file.file_size || 0) / 1024)} KB)
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <a
                                        href={`http://localhost:5000/${file.filepath}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                    >
                                        View / Download
                                    </a>
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteFile(file.id)}
                                        className="text-red-600 hover:underline text-xs"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Edit Task Modal */}
            {showEditForm && (
                <EditTaskForm
                    task={task}
                    onTaskUpdated={handleTaskUpdated}
                    onClose={() => setShowEditForm(false)}
                />
            )}
        </div>
    );
}

export default TaskDetails;