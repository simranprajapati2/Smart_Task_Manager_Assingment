"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

const API = "http://localhost:5000/api";

export default function Home() {
    // =========================
    // STATE
    // =========================

    const [users, setUsers] = useState([]);
    const [tasks, setTasks] = useState([]);

    const [currentUser, setCurrentUser] = useState(null);
    const [activePage, setActivePage] = useState("dashboard");
    const [message, setMessage] = useState("");

    // Login
    const [loginEmail, setLoginEmail] = useState("");

    // Create User
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [showRegister, setShowRegister] = useState(false);

    // Task
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("Medium");
    const [status, setStatus] = useState("To Do");
    const [assignedTo, setAssignedTo] = useState("");
    const [dependency, setDependency] = useState("");

    // Edit
    const [editingId, setEditingId] = useState(null);

    // =========================
    // GET USERS
    // =========================

    async function getUsers() {
        try {
            const response = await fetch(`${API}/users`);

            if (!response.ok) {
                throw new Error("Failed to fetch users");
            }

            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error("Get users error:", error);
        }
    }

    // =========================
    // GET TASKS
    // =========================

    async function getTasks() {
        try {
            const response = await fetch(`${API}/tasks`);

            if (!response.ok) {
                throw new Error("Failed to fetch tasks");
            }

            const data = await response.json();
            setTasks(data);
        } catch (error) {
            console.error("Get tasks error:", error);
        }
    }

    // =========================
    // INITIAL DATA
    // =========================

    useEffect(() => {
        getUsers();
        getTasks();
    }, []);

    // =========================
    // REAL TIME REFRESH
    // =========================

    useEffect(() => {
        if (!currentUser) {
            return;
        }

        const timer = setInterval(() => {
            getTasks();
        }, 3000);

        return () => clearInterval(timer);
    }, [currentUser]);

    // =========================
    // CREATE USER
    // =========================

    async function createUser() {
        if (!name.trim() || !email.trim()) {
            setMessage("Please enter name and email");
            return;
        }

        try {
            const response = await fetch(`${API}/users`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: name.trim(),
                    email: email.trim(),
                }),
            });

            const data = await response.json();

            setMessage(data.message);

            if (response.ok) {
                setName("");
                setEmail("");

                setShowRegister(false);

                await getUsers();
            }
        } catch (error) {
            console.error("Create user error:", error);

            setMessage(
                "Unable to connect to backend. Please start the server."
            );
        }
    }

    // =========================
    // LOGIN
    // =========================

    async function login() {
        if (!loginEmail.trim()) {
            setMessage("Please enter email");
            return;
        }

        try {
            const response = await fetch(`${API}/users/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: loginEmail.trim(),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message);
                return;
            }

            setCurrentUser(data.user);
            setLoginEmail("");

            setMessage(`Welcome ${data.user.name}!`);
        } catch (error) {
            console.error("Login error:", error);

            setMessage(
                "Unable to connect to backend. Please start the server."
            );
        }
    }

    // =========================
    // LOGOUT
    // =========================

    function logout() {
        setCurrentUser(null);
        setActivePage("dashboard");
        setMessage("Logged out successfully");
    }

    // =========================
    // SAVE TASK
    // =========================

    async function saveTask() {
        if (!title.trim()) {
            setMessage("Task title is required");
            return;
        }

        const taskData = {
            title: title.trim(),
            description,
            priority,
            status,
            assignedTo,
            dependency,
        };

        try {
            let response;

            if (editingId) {
                response = await fetch(`${API}/tasks/${editingId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(taskData),
                });
            } else {
                response = await fetch(`${API}/tasks`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(taskData),
                });
            }

            const data = await response.json();

            setMessage(data.message);

            if (response.ok) {
                clearForm();
                await getTasks();
                setActivePage("dashboard");
            }
        } catch (error) {
            console.error("Save task error:", error);
            setMessage("Unable to connect to backend.");
        }
    }

    // =========================
    // EDIT TASK
    // =========================

    function editTask(task) {
        setEditingId(task.id);
        setTitle(task.title);
        setDescription(task.description || "");
        setPriority(task.priority);
        setStatus(task.status);
        setAssignedTo(task.assignedTo || "");
        setDependency(task.dependency || "");

        setActivePage("create");

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    // =========================
    // DELETE TASK
    // =========================

    async function deleteTask(id) {
        try {
            const response = await fetch(`${API}/tasks/${id}`, {
                method: "DELETE",
            });

            const data = await response.json();

            setMessage(data.message);

            await getTasks();
        } catch (error) {
            console.error("Delete task error:", error);
            setMessage("Unable to connect to backend.");
        }
    }

    // =========================
    // CHANGE STATUS
    // =========================

    async function changeStatus(id, newStatus) {
        try {
            const response = await fetch(
                `${API}/tasks/${id}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        status: newStatus,
                    }),
                }
            );

            const data = await response.json();

            setMessage(data.message);

            await getTasks();
        } catch (error) {
            console.error("Change status error:", error);
            setMessage("Unable to connect to backend.");
        }
    }

    // =========================
    // CLEAR FORM
    // =========================

    function clearForm() {
        setEditingId(null);
        setTitle("");
        setDescription("");
        setPriority("Medium");
        setStatus("To Do");
        setAssignedTo("");
        setDependency("");
    }

    // =========================
    // GET USER NAME
    // =========================

    function getUserName(id) {
        const user = users.find((user) => user.id === id);

        return user ? user.name : "Not assigned";
    }

    // =========================
    // CHECK BLOCKED
    // =========================

    function isBlocked(task) {
        if (!task.dependency) {
            return false;
        }

        const dependencyTask = tasks.find(
            (item) => item.id === task.dependency
        );

        return (
            dependencyTask &&
            dependencyTask.status !== "Done"
        );
    }

    // =========================
    // FILTER TASKS
    // =========================

    function getVisibleTasks() {
        if (activePage === "mytasks") {
            return tasks.filter(
                (task) =>
                    task.assignedTo === currentUser?.id
            );
        }

        if (activePage === "blocked") {
            return tasks.filter((task) => isBlocked(task));
        }

        if (activePage === "high") {
            return tasks.filter(
                (task) => task.priority === "High"
            );
        }

        return tasks;
    }

    const visibleTasks = getVisibleTasks();

    // ==================================================
    // LOGIN / REGISTER SCREEN
    // ==================================================

    if (!currentUser) {
        return (
            <main className={styles.loginPage}>
                <div className={styles.loginCard}>

                    <div className={styles.logo}>
                        ✓
                    </div>

                    <h1>
                        Smart Task Manager
                    </h1>

                    <p>
                        {showRegister
                            ? "Create your account"
                            : "Login to manage your tasks"}
                    </p>

                    {/* ================= LOGIN ================= */}

                    {!showRegister && (
                        <>
                            <input
                                className={styles.input}
                                placeholder="Enter email"
                                type="email"
                                value={loginEmail}
                                onChange={(e) =>
                                    setLoginEmail(
                                        e.target.value
                                    )
                                }
                            />

                            <button
                                type="button"
                                className={styles.button}
                                onClick={login}
                            >
                                Login
                            </button>

                            <p>
                                Don't have an account?
                            </p>

                            <button
                                type="button"
                                className={styles.linkButton}
                                onClick={() => {
                                    setMessage("");
                                    setShowRegister(true);
                                }}
                            >
                                Create New User
                            </button>
                        </>
                    )}

                    {/* ================= REGISTER ================= */}

                    {showRegister && (
                        <>
                            <h2>
                                Create New User
                            </h2>

                            <input
                                className={styles.input}
                                placeholder="Enter name"
                                type="text"
                                value={name}
                                onChange={(e) =>
                                    setName(
                                        e.target.value
                                    )
                                }
                            />

                            <input
                                className={styles.input}
                                placeholder="Enter email"
                                type="email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(
                                        e.target.value
                                    )
                                }
                            />

                            <button
                                type="button"
                                className={styles.button}
                                onClick={createUser}
                            >
                                Create User
                            </button>

                            <button
                                type="button"
                                className={
                                    styles.secondaryButton
                                }
                                onClick={() => {
                                    setMessage("");
                                    setShowRegister(false);
                                }}
                            >
                                Back to Login
                            </button>
                        </>
                    )}

                    {/* MESSAGE */}

                    {message && (
                        <div className={styles.message}>
                            {message}
                        </div>
                    )}
                </div>
            </main>
        );
    }

    // ==================================================
    // DASHBOARD
    // ==================================================

    return (
        <main className={styles.container}>

            {/* ================= NAVBAR ================= */}

            <nav className={styles.navbar}>

                <div className={styles.brand}>
                    ✓ Smart Task Manager
                </div>

                <div className={styles.navLinks}>

                    <button
                        type="button"
                        className={
                            activePage === "dashboard"
                                ? styles.activeNav
                                : styles.navButton
                        }
                        onClick={() =>
                            setActivePage("dashboard")
                        }
                    >
                        Dashboard
                    </button>

                    <button
                        type="button"
                        className={
                            activePage === "users"
                                ? styles.activeNav
                                : styles.navButton
                        }
                        onClick={() =>
                            setActivePage("users")
                        }
                    >
                        All Users
                    </button>

                    <button
                        type="button"
                        className={
                            activePage === "create"
                                ? styles.activeNav
                                : styles.navButton
                        }
                        onClick={() =>
                            setActivePage("create")
                        }
                    >
                        Create Task
                    </button>

                    <button
                        type="button"
                        className={
                            activePage === "mytasks"
                                ? styles.activeNav
                                : styles.navButton
                        }
                        onClick={() =>
                            setActivePage("mytasks")
                        }
                    >
                        My Tasks
                    </button>

                    <button
                        type="button"
                        className={
                            activePage === "blocked"
                                ? styles.activeNav
                                : styles.navButton
                        }
                        onClick={() =>
                            setActivePage("blocked")
                        }
                    >
                        Blocked
                    </button>

                    <button
                        type="button"
                        className={
                            activePage === "high"
                                ? styles.activeNav
                                : styles.navButton
                        }
                        onClick={() =>
                            setActivePage("high")
                        }
                    >
                        High Priority
                    </button>

                    <button
                        type="button"
                        className={styles.logoutButton}
                        onClick={logout}
                    >
                        Logout
                    </button>

                </div>
            </nav>

            {/* ================= MESSAGE ================= */}

            {message && (
                <div className={styles.message}>
                    {message}
                </div>
            )}

            {/* ================= DASHBOARD ================= */}

            {activePage === "dashboard" && (
                <section>

                    <div className={styles.welcome}>

                        <h1>
                            Welcome, {currentUser.name}!
                        </h1>

                        <p>
                            Manage your tasks easily
                            from one place.
                        </p>

                    </div>

                    <div className={styles.statsGrid}>

                        <div className={styles.statCard}>
                            <h3>Total Tasks</h3>

                            <strong>
                                {tasks.length}
                            </strong>
                        </div>

                        <div className={styles.statCard}>
                            <h3>Completed</h3>

                            <strong>
                                {
                                    tasks.filter(
                                        (task) =>
                                            task.status ===
                                            "Done"
                                    ).length
                                }
                            </strong>
                        </div>

                        <div className={styles.statCard}>
                            <h3>In Progress</h3>

                            <strong>
                                {
                                    tasks.filter(
                                        (task) =>
                                            task.status ===
                                            "In Progress"
                                    ).length
                                }
                            </strong>
                        </div>

                        <div className={styles.statCard}>
                            <h3>Blocked</h3>

                            <strong>
                                {
                                    tasks.filter((task) =>
                                        isBlocked(task)
                                    ).length
                                }
                            </strong>
                        </div>

                    </div>
                </section>
            )}

            {/*  USERS */}

            {activePage === "users" && (
                <section className={styles.card}>

                    <h2>All Users</h2>

                    {users.length === 0 ? (
                        <p>No users found</p>
                    ) : (
                        users.map((user) => (
                            <div
                                className={styles.user}
                                key={user.id}
                            >
                                <strong>
                                    {user.name}
                                </strong>

                                <p>
                                    {user.email}
                                </p>
                            </div>
                        ))
                    )}

                </section>
            )}

            {/*CREATE TASk */}

            {activePage === "create" && (
                <section className={styles.card}>

                    <h2>
                        {editingId
                            ? "Edit Task"
                            : "Create New Task"}
                    </h2>

                    <input
                        className={styles.input}
                        placeholder="Task Title"
                        value={title}
                        onChange={(e) =>
                            setTitle(e.target.value)
                        }
                    />

                    <textarea
                        className={styles.textarea}
                        placeholder="Description"
                        value={description}
                        onChange={(e) =>
                            setDescription(
                                e.target.value
                            )
                        }
                    />

                    <div className={styles.formGrid}>

                        <div>
                            <label>Priority</label>

                            <select
                                className={styles.select}
                                value={priority}
                                onChange={(e) =>
                                    setPriority(
                                        e.target.value
                                    )
                                }
                            >
                                <option>Low</option>
                                <option>Medium</option>
                                <option>High</option>
                            </select>
                        </div>

                        <div>
                            <label>Status</label>

                            <select
                                className={styles.select}
                                value={status}
                                onChange={(e) =>
                                    setStatus(
                                        e.target.value
                                    )
                                }
                            >
                                <option>To Do</option>
                                <option>In Progress</option>
                                <option>Done</option>
                            </select>
                        </div>

                        <div>
                            <label>Assign To</label>

                            <select
                                className={styles.select}
                                value={assignedTo}
                                onChange={(e) =>
                                    setAssignedTo(
                                        e.target.value
                                    )
                                }
                            >
                                <option value="">
                                    Select User
                                </option>

                                {users.map((user) => (
                                    <option
                                        key={user.id}
                                        value={user.id}
                                    >
                                        {user.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label>Dependency</label>

                            <select
                                className={styles.select}
                                value={dependency}
                                onChange={(e) =>
                                    setDependency(
                                        e.target.value
                                    )
                                }
                            >
                                <option value="">
                                    No Dependency
                                </option>

                                {tasks
                                    .filter(
                                        (task) =>
                                            task.id !==
                                            editingId
                                    )
                                    .map((task) => (
                                        <option
                                            key={task.id}
                                            value={task.id}
                                        >
                                            {task.title}
                                        </option>
                                    ))}
                            </select>
                        </div>

                    </div>

                    <button
                        type="button"
                        className={styles.button}
                        onClick={saveTask}
                    >
                        {editingId
                            ? "Update Task"
                            : "Create Task"}
                    </button>

                    {editingId && (
                        <button
                            type="button"
                            className={
                                styles.secondaryButton
                            }
                            onClick={clearForm}
                        >
                            Cancel
                        </button>
                    )}

                </section>
            )}

            {/* TASK LIST */}

            {[
                "dashboard",
                "mytasks",
                "blocked",
                "high",
            ].includes(activePage) && (
                <section className={styles.card}>

                    <h2>
                        {activePage === "mytasks"
                            ? "My Tasks"
                            : activePage === "blocked"
                            ? "Blocked Tasks"
                            : activePage === "high"
                            ? "High Priority Tasks"
                            : "All Tasks"}
                    </h2>

                    {visibleTasks.length === 0 ? (
                        <p>No tasks found.</p>
                    ) : (
                        <div>

                            {visibleTasks.map((task) => (
                                <div
                                    className={styles.task}
                                    key={task.id}
                                >

                                    <div>

                                        <h3>
                                            {task.title}
                                        </h3>

                                        <p>
                                            {task.description}
                                        </p>

                                        <div
                                            className={
                                                styles.tags
                                            }
                                        >

                                            <span
                                                className={
                                                    styles.tag
                                                }
                                            >
                                                Priority:{" "}
                                                {task.priority}
                                            </span>

                                            <span
                                                className={
                                                    styles.tag
                                                }
                                            >
                                                Status:{" "}
                                                {task.status}
                                            </span>

                                            <span
                                                className={
                                                    styles.tag
                                                }
                                            >
                                                Assigned:{" "}
                                                {getUserName(
                                                    task.assignedTo
                                                )}
                                            </span>

                                            <span
                                                className={
                                                    styles.tag
                                                }
                                            >
                                                Dependency:{" "}
                                                {task.dependency
                                                    ? tasks.find(
                                                          (t) =>
                                                              t.id ===
                                                              task.dependency
                                                      )?.title ||
                                                      "Not found"
                                                    : "None"}
                                            </span>

                                        </div>

                                        {isBlocked(task) && (
                                            <p
                                                className={
                                                    styles.blocked
                                                }
                                            >
                                                This task is
                                                blocked.
                                                Complete
                                                dependency
                                                first.
                                            </p>
                                        )}

                                    </div>

                                    <div
                                        className={
                                            styles.taskActions
                                        }
                                    >

                                        <select
                                            className={
                                                styles.smallSelect
                                            }
                                            value={task.status}
                                            onChange={(e) =>
                                                changeStatus(
                                                    task.id,
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <option>
                                                To Do
                                            </option>

                                            <option>
                                                In Progress
                                            </option>

                                            <option>
                                                Done
                                            </option>
                                        </select>

                                        <button
                                            type="button"
                                            className={
                                                styles.editButton
                                            }
                                            onClick={() =>
                                                editTask(task)
                                            }
                                        >
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            className={
                                                styles.deleteButton
                                            }
                                            onClick={() =>
                                                deleteTask(
                                                    task.id
                                                )
                                            }
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </div>
                            ))}

                        </div>
                    )}

                </section>
            )}

        </main>
    );
}