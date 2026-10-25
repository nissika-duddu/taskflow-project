
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const categoryInput = document.getElementById("categoryInput");
const searchInput = document.getElementById("searchInput");
const filterInput = document.getElementById("filterInput");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");
const submitButton = document.getElementById("submitButton");

let tasks = [];
let nextId = 1;
let editingId = null;

// Display today's date
document.getElementById("currentDate").textContent =
    new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });

// Add or update a task
taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const title = taskInput.value.trim();

    if (!title) {
        alert("Please enter a task!");
        return;
    }

    if (editingId !== null) {
        const task = tasks.find(task => task.id === editingId);

        if (task) {
            task.title = title;
            task.category = categoryInput.value;
        }

        editingId = null;
        submitButton.textContent = "+ Add Task";
    } else {
        const newTask = {
            id: nextId++,
            title: title,
            category: categoryInput.value,
            completed: false
        };

        tasks.push(newTask);
    }

    taskInput.value = "";
    categoryInput.value = "Personal";
    renderTasks();
});

// Display tasks and update statistics
function renderTasks() {
    taskList.innerHTML = "";

    const searchTerm = searchInput.value.toLowerCase();
    const filter = filterInput.value;

    const filteredTasks = tasks.filter(function (task) {
        const matchesSearch =
            task.title.toLowerCase().includes(searchTerm) ||
            task.category.toLowerCase().includes(searchTerm);

        const matchesFilter =
            filter === "all" ||
            (filter === "completed" && task.completed) ||
            (filter === "pending" && !task.completed);

        return matchesSearch && matchesFilter;
    });

    filteredTasks.forEach(function (task) {
        const item = document.createElement("div");
        item.className = "task-item";

        if (task.completed) {
            item.classList.add("completed");
        }

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "task-check";
        checkbox.checked = task.completed;
        checkbox.setAttribute("aria-label", "Mark task complete");

        checkbox.addEventListener("change", function () {
            task.completed = checkbox.checked;
            renderTasks();
        });

        const details = document.createElement("div");
        details.className = "task-details";

        const title = document.createElement("p");
        title.className = "task-title";
        title.textContent = task.title;

        const meta = document.createElement("div");
        meta.className = "task-meta";

        const category = document.createElement("span");
        category.className = "category";
        category.textContent = task.category;

        meta.appendChild(category);
        details.append(title, meta);

        const actions = document.createElement("div");
        actions.className = "task-actions";

        const editButton = document.createElement("button");
        editButton.className = "edit-btn";
        editButton.textContent = "Edit";

        editButton.addEventListener("click", function () {
            taskInput.value = task.title;
            categoryInput.value = task.category;
            editingId = task.id;
            submitButton.textContent = "Save Changes";
            taskInput.focus();
        });

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function () {
            tasks = tasks.filter(item => item.id !== task.id);

            if (editingId === task.id) {
                editingId = null;
                taskForm.reset();
                submitButton.textContent = "+ Add Task";
            }

            renderTasks();
        });

        actions.append(editButton, deleteButton);
        item.append(checkbox, details, actions);
        taskList.appendChild(item);
    });

    emptyMessage.style.display =
        filteredTasks.length === 0 ? "block" : "none";

    document.getElementById("totalTasks").textContent = tasks.length;

    const completed = tasks.filter(task => task.completed).length;
    const pending = tasks.length - completed;

    document.getElementById("completedTasks").textContent = completed;
    document.getElementById("pendingTasks").textContent = pending;

    const progress = tasks.length
        ? Math.round((completed / tasks.length) * 100)
        : 0;

    document.getElementById("progressText").textContent = progress + "%";
    document.getElementById("progressBar").style.width = progress + "%";
}

// Search and filter tasks
searchInput.addEventListener("input", renderTasks);
filterInput.addEventListener("change", renderTasks);

// Initial display
renderTasks();
