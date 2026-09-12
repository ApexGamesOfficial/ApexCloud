const STORAGE_KEY =
  "apexCloudProjects";

const CURRENT_PROJECT_KEY =
  "apexCloudCurrentProject";

let projects = [];
let currentProjectId = null;
let currentView = "overview";
let resourceMode = null;

/* ----------------------------- */
/* ELEMENTS */
/* ----------------------------- */

const sidebar =
  document.getElementById("sidebar");

const sidebarOverlay =
  document.getElementById(
    "sidebarOverlay"
  );

const mobileMenuButton =
  document.getElementById(
    "mobileMenuButton"
  );

const sidebarCloseButton =
  document.getElementById(
    "sidebarCloseButton"
  );

const homeButton =
  document.getElementById(
    "homeButton"
  );

const newProjectButton =
  document.getElementById(
    "newProjectButton"
  );

const emptyCreateButton =
  document.getElementById(
    "emptyCreateButton"
  );

const projectSwitcher =
  document.getElementById(
    "projectSwitcher"
  );

const projectSwitcherName =
  document.getElementById(
    "projectSwitcherName"
  );

const projectSwitcherRegion =
  document.getElementById(
    "projectSwitcherRegion"
  );

const projectSwitcherIcon =
  document.getElementById(
    "projectSwitcherIcon"
  );

const projectMenu =
  document.getElementById(
    "projectMenu"
  );

const projectMenuList =
  document.getElementById(
    "projectMenuList"
  );

const projectMenuNewButton =
  document.getElementById(
    "projectMenuNewButton"
  );

const emptyWorkspace =
  document.getElementById(
    "emptyWorkspace"
  );

const projectWorkspace =
  document.getElementById(
    "projectWorkspace"
  );

const navItems =
  document.querySelectorAll(
    ".nav-item"
  );

const viewPanels =
  document.querySelectorAll(
    "[data-view-panel]"
  );

const serviceButtons =
  document.querySelectorAll(
    "[data-open-view]"
  );

/* CREATE PROJECT */

const createProjectModal =
  document.getElementById(
    "createProjectModal"
  );

const createProjectForm =
  document.getElementById(
    "createProjectForm"
  );

const closeProjectModalButton =
  document.getElementById(
    "closeProjectModalButton"
  );

const cancelCreateProjectButton =
  document.getElementById(
    "cancelCreateProjectButton"
  );

const projectNameInput =
  document.getElementById(
    "projectNameInput"
  );

const projectDescriptionInput =
  document.getElementById(
    "projectDescriptionInput"
  );

const projectRegionInput =
  document.getElementById(
    "projectRegionInput"
  );

/* OVERVIEW */

const overviewProjectName =
  document.getElementById(
    "overviewProjectName"
  );

const overviewProjectDescription =
  document.getElementById(
    "overviewProjectDescription"
  );

const overviewProjectId =
  document.getElementById(
    "overviewProjectId"
  );

const overviewCreatedAt =
  document.getElementById(
    "overviewCreatedAt"
  );

const overviewRegion =
  document.getElementById(
    "overviewRegion"
  );

const databaseTableCount =
  document.getElementById(
    "databaseTableCount"
  );

const storageBucketCount =
  document.getElementById(
    "storageBucketCount"
  );

/* DATABASE */

const createTableButton =
  document.getElementById(
    "createTableButton"
  );

const databaseTableList =
  document.getElementById(
    "databaseTableList"
  );

const databaseEmpty =
  document.getElementById(
    "databaseEmpty"
  );

/* STORAGE */

const createBucketButton =
  document.getElementById(
    "createBucketButton"
  );

const storageBucketList =
  document.getElementById(
    "storageBucketList"
  );

const storageEmpty =
  document.getElementById(
    "storageEmpty"
  );

/* API */

const apiProjectUrl =
  document.getElementById(
    "apiProjectUrl"
  );

const apiProjectKey =
  document.getElementById(
    "apiProjectKey"
  );

const apiExample =
  document.getElementById(
    "apiExample"
  );

const copyApiUrlButton =
  document.getElementById(
    "copyApiUrlButton"
  );

const copyApiKeyButton =
  document.getElementById(
    "copyApiKeyButton"
  );

/* SETTINGS */

const settingsProjectName =
  document.getElementById(
    "settingsProjectName"
  );

const settingsProjectDescription =
  document.getElementById(
    "settingsProjectDescription"
  );

const saveProjectSettingsButton =
  document.getElementById(
    "saveProjectSettingsButton"
  );

const deleteProjectButton =
  document.getElementById(
    "deleteProjectButton"
  );

/* RESOURCE MODAL */

const resourceModal =
  document.getElementById(
    "resourceModal"
  );

const resourceModalEyebrow =
  document.getElementById(
    "resourceModalEyebrow"
  );

const resourceModalTitle =
  document.getElementById(
    "resourceModalTitle"
  );

const closeResourceModalButton =
  document.getElementById(
    "closeResourceModalButton"
  );

const cancelResourceButton =
  document.getElementById(
    "cancelResourceButton"
  );

const resourceForm =
  document.getElementById(
    "resourceForm"
  );

const resourceNameInput =
  document.getElementById(
    "resourceNameInput"
  );

const resourceSubmitButton =
  document.getElementById(
    "resourceSubmitButton"
  );

const toast =
  document.getElementById(
    "toast"
  );

/* ----------------------------- */
/* STORAGE */
/* ----------------------------- */

function loadProjects() {
  try {
    const saved =
      localStorage.getItem(
        STORAGE_KEY
      );

    projects =
      saved
        ? JSON.parse(saved)
        : [];

    currentProjectId =
      localStorage.getItem(
        CURRENT_PROJECT_KEY
      );

    if (
      currentProjectId &&
      !projects.some(
        (project) =>
          project.id ===
          currentProjectId
      )
    ) {
      currentProjectId = null;

      localStorage.removeItem(
        CURRENT_PROJECT_KEY
      );
    }
  } catch (error) {
    console.error(
      "Unable to load ApexCloud projects.",
      error
    );

    projects = [];
    currentProjectId = null;
  }
}

function saveProjects() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(projects)
  );
}

function saveCurrentProject() {
  if (currentProjectId) {
    localStorage.setItem(
      CURRENT_PROJECT_KEY,
      currentProjectId
    );
  } else {
    localStorage.removeItem(
      CURRENT_PROJECT_KEY
    );
  }
}

/* ----------------------------- */
/* HELPERS */
/* ----------------------------- */

function makeId(prefix = "prj") {
  if (
    window.crypto &&
    crypto.randomUUID
  ) {
    return `${prefix}_${crypto
      .randomUUID()
      .replaceAll("-", "")
      .slice(0, 12)}`;
  }

  return `${prefix}_${Date.now()
    .toString(36)}${Math.random()
    .toString(36)
    .slice(2, 7)}`;
}

function createPrototypeKey() {
  return `ac_dev_${Math.random()
    .toString(36)
    .slice(2, 10)}${Date.now()
    .toString(36)}`;
}

function getCurrentProject() {
  return projects.find(
    (project) =>
      project.id ===
      currentProjectId
  );
}

function formatDate(dateValue) {
  const date =
    new Date(dateValue);

  return date.toLocaleDateString(
    undefined,
    {
      year: "numeric",
      month: "short",
      day: "numeric"
    }
  );
}

function getProjectInitial(name) {
  return (
    name.trim().charAt(0) || "A"
  ).toUpperCase();
}

/* ----------------------------- */
/* TOAST */
/* ----------------------------- */

let toastTimer;

function showToast(message) {
  clearTimeout(toastTimer);

  toast.textContent = message;
  toast.hidden = false;

  toastTimer =
    setTimeout(() => {
      toast.hidden = true;
    }, 1800);
}

/* ----------------------------- */
/* SIDEBAR */
/* ----------------------------- */

function openSidebar() {
  sidebar.classList.add("open");

  sidebarOverlay.classList.add(
    "visible"
  );
}

function closeSidebar() {
  sidebar.classList.remove("open");

  sidebarOverlay.classList.remove(
    "visible"
  );
}

mobileMenuButton.addEventListener(
  "click",
  openSidebar
);

sidebarCloseButton.addEventListener(
  "click",
  closeSidebar
);

sidebarOverlay.addEventListener(
  "click",
  closeSidebar
);

/* ----------------------------- */
/* PROJECT MODAL */
/* ----------------------------- */

function openProjectModal() {
  projectMenu.hidden = true;

  createProjectForm.reset();

  projectRegionInput.value =
    "US East";

  createProjectModal.hidden =
    false;

  requestAnimationFrame(() => {
    projectNameInput.focus();
  });
}

function closeProjectModal() {
  createProjectModal.hidden =
    true;
}

newProjectButton.addEventListener(
  "click",
  openProjectModal
);

emptyCreateButton.addEventListener(
  "click",
  openProjectModal
);

projectMenuNewButton.addEventListener(
  "click",
  openProjectModal
);

closeProjectModalButton.addEventListener(
  "click",
  closeProjectModal
);

cancelCreateProjectButton.addEventListener(
  "click",
  closeProjectModal
);

createProjectModal.addEventListener(
  "click",
  (event) => {
    if (
      event.target ===
      createProjectModal
    ) {
      closeProjectModal();
    }
  }
);

createProjectForm.addEventListener(
  "submit",
  (event) => {
    event.preventDefault();

    const name =
      projectNameInput.value.trim();

    const description =
      projectDescriptionInput.value.trim();

    const region =
      projectRegionInput.value;

    if (!name) {
      return;
    }

    const project = {
      id: makeId("prj"),

      name,

      description:
        description ||
        "ApexCloud project.",

      region,

      createdAt:
        new Date().toISOString(),

      developmentKey:
        createPrototypeKey(),

      tables: [],

      buckets: []
    };

    projects.unshift(project);

    currentProjectId =
      project.id;

    saveProjects();
    saveCurrentProject();

    closeProjectModal();

    currentView = "overview";

    render();

    showToast(
      `${project.name} created`
    );
  }
);

/* ----------------------------- */
/* PROJECT SWITCHER */
/* ----------------------------- */

projectSwitcher.addEventListener(
  "click",
  (event) => {
    event.stopPropagation();

    projectMenu.hidden =
      !projectMenu.hidden;
  }
);

document.addEventListener(
  "click",
  (event) => {
    if (
      !projectMenu.hidden &&
      !projectMenu.contains(
        event.target
      ) &&
      !projectSwitcher.contains(
        event.target
      )
    ) {
      projectMenu.hidden = true;
    }
  }
);

function renderProjectMenu() {
  projectMenuList.innerHTML = "";

  if (projects.length === 0) {
    const message =
      document.createElement(
        "div"
      );

    message.className =
      "project-menu-heading";

    message.textContent =
      "No projects yet.";

    projectMenuList.appendChild(
      message
    );

    return;
  }

  projects.forEach((project) => {
    const button =
      document.createElement(
        "button"
      );

    button.type = "button";

    button.className =
      "project-menu-item";

    if (
      project.id ===
      currentProjectId
    ) {
      button.classList.add(
        "active"
      );
    }

    const icon =
      document.createElement(
        "span"
      );

    icon.className =
      "project-menu-item-icon";

    icon.textContent =
      getProjectInitial(
        project.name
      );

    const copy =
      document.createElement(
        "span"
      );

    copy.className =
      "project-menu-item-copy";

    const title =
      document.createElement(
        "strong"
      );

    title.textContent =
      project.name;

    const region =
      document.createElement(
        "span"
      );

    region.textContent =
      project.region;

    copy.append(
      title,
      region
    );

    button.append(
      icon,
      copy
    );

    button.addEventListener(
      "click",
      () => {
        currentProjectId =
          project.id;

        currentView =
          "overview";

        saveCurrentProject();

        projectMenu.hidden = true;

        render();
      }
    );

    projectMenuList.appendChild(
      button
    );
  });
}

/* ----------------------------- */
/* NAVIGATION */
/* ----------------------------- */

function switchView(viewName) {
  if (!getCurrentProject()) {
    return;
  }

  currentView = viewName;

  navItems.forEach((item) => {
    item.classList.toggle(
      "active",
      item.dataset.view ===
        viewName
    );
  });

  viewPanels.forEach(
    (panel) => {
      panel.classList.toggle(
        "active-view",
        panel.dataset.viewPanel ===
          viewName
      );
    }
  );

  closeSidebar();
}

navItems.forEach((item) => {
  item.addEventListener(
    "click",
    () => {
      switchView(
        item.dataset.view
      );
    }
  );
});

serviceButtons.forEach(
  (button) => {
    button.addEventListener(
      "click",
      () => {
        switchView(
          button.dataset.openView
        );
      }
    );
  }
);

homeButton.addEventListener(
  "click",
  () => {
    if (getCurrentProject()) {
      switchView("overview");
    }
  }
);

/* ----------------------------- */
/* RESOURCE MODAL */
/* ----------------------------- */

function openResourceModal(mode) {
  if (!getCurrentProject()) {
    return;
  }

  resourceMode = mode;

  resourceForm.reset();

  if (mode === "table") {
    resourceModalEyebrow.textContent =
      "DATABASE";

    resourceModalTitle.textContent =
      "Create table";

    resourceSubmitButton.textContent =
      "Create table";

    resourceNameInput.placeholder =
      "users";
  } else {
    resourceModalEyebrow.textContent =
      "STORAGE";

    resourceModalTitle.textContent =
      "Create bucket";

    resourceSubmitButton.textContent =
      "Create bucket";

    resourceNameInput.placeholder =
      "project-assets";
  }

  resourceModal.hidden =
    false;

  requestAnimationFrame(() => {
    resourceNameInput.focus();
  });
}

function closeResourceModal() {
  resourceModal.hidden = true;
  resourceMode = null;
}

createTableButton.addEventListener(
  "click",
  () => {
    openResourceModal("table");
  }
);

createBucketButton.addEventListener(
  "click",
  () => {
    openResourceModal("bucket");
  }
);

closeResourceModalButton.addEventListener(
  "click",
  closeResourceModal
);

cancelResourceButton.addEventListener(
  "click",
  closeResourceModal
);

resourceModal.addEventListener(
  "click",
  (event) => {
    if (
      event.target ===
      resourceModal
    ) {
      closeResourceModal();
    }
  }
);

resourceForm.addEventListener(
  "submit",
  (event) => {
    event.preventDefault();

    const project =
      getCurrentProject();

    if (!project) {
      return;
    }

    const name =
      resourceNameInput.value
        .trim();

    if (!name) {
      return;
    }

    if (
      resourceMode === "table"
    ) {
      project.tables.push({
        id: makeId("tbl"),

        name,

        createdAt:
          new Date().toISOString()
      });

      showToast(
        `Table "${name}" created`
      );
    }

    if (
      resourceMode === "bucket"
    ) {
      project.buckets.push({
        id: makeId("bkt"),

        name,

        createdAt:
          new Date().toISOString()
      });

      showToast(
        `Bucket "${name}" created`
      );
    }

    saveProjects();

    closeResourceModal();

    renderProject();
  }
);

/* ----------------------------- */
/* DATABASE */
/* ----------------------------- */

function renderTables(project) {
  databaseTableList.innerHTML =
    "";

  const tables =
    project.tables || [];

  databaseEmpty.hidden =
    tables.length > 0;

  databaseTableList.hidden =
    tables.length === 0;

  tables.forEach((table) => {
    const row =
      document.createElement(
        "div"
      );

    row.className =
      "resource-row";

    const icon =
      document.createElement(
        "span"
      );

    icon.className =
      "resource-icon";

    icon.textContent = "◉";

    const copy =
      document.createElement(
        "span"
      );

    copy.className =
      "resource-copy";

    const title =
      document.createElement(
        "strong"
      );

    title.textContent =
      table.name;

    const meta =
      document.createElement(
        "span"
      );

    meta.textContent =
      `Created ${formatDate(
        table.createdAt
      )}`;

    copy.append(
      title,
      meta
    );

    const tag =
      document.createElement(
        "span"
      );

    tag.className =
      "resource-tag";

    tag.textContent = "TABLE";

    row.append(
      icon,
      copy,
      tag
    );

    databaseTableList.appendChild(
      row
    );
  });
}

/* ----------------------------- */
/* STORAGE */
/* ----------------------------- */

function renderBuckets(project) {
  storageBucketList.innerHTML =
    "";

  const buckets =
    project.buckets || [];

  storageEmpty.hidden =
    buckets.length > 0;

  storageBucketList.hidden =
    buckets.length === 0;

  buckets.forEach((bucket) => {
    const row =
      document.createElement(
        "div"
      );

    row.className =
      "resource-row";

    const icon =
      document.createElement(
        "span"
      );

    icon.className =
      "resource-icon";

    icon.textContent = "▣";

    const copy =
      document.createElement(
        "span"
      );

    copy.className =
      "resource-copy";

    const title =
      document.createElement(
        "strong"
      );

    title.textContent =
      bucket.name;

    const meta =
      document.createElement(
        "span"
      );

    meta.textContent =
      `Created ${formatDate(
        bucket.createdAt
      )}`;

    copy.append(
      title,
      meta
    );

    const tag =
      document.createElement(
        "span"
      );

    tag.className =
      "resource-tag";

    tag.textContent =
      "BUCKET";

    row.append(
      icon,
      copy,
      tag
    );

    storageBucketList.appendChild(
      row
    );
  });
}

/* ----------------------------- */
/* API */
/* ----------------------------- */

function renderApi(project) {
  const slug =
    project.id
      .replace("prj_", "")
      .toLowerCase();

  const url =
    `https://api.apexcloud.dev/v1/${slug}`;

  apiProjectUrl.textContent =
    url;

  apiProjectKey.textContent =
    project.developmentKey;

  apiExample.textContent =
`fetch("${url}/data", {
  headers: {
    "x-apex-key": "${project.developmentKey}"
  }
});`;
}

async function copyText(
  value,
  successMessage
) {
  try {
    await navigator.clipboard.writeText(
      value
    );

    showToast(successMessage);
  } catch {
    showToast(
      "Unable to copy"
    );
  }
}

copyApiUrlButton.addEventListener(
  "click",
  () => {
    const project =
      getCurrentProject();

    if (!project) {
      return;
    }

    copyText(
      apiProjectUrl.textContent,
      "Project URL copied"
    );
  }
);

copyApiKeyButton.addEventListener(
  "click",
  () => {
    const project =
      getCurrentProject();

    if (!project) {
      return;
    }

    copyText(
      apiProjectKey.textContent,
      "Development key copied"
    );
  }
);

/* ----------------------------- */
/* SETTINGS */
/* ----------------------------- */

saveProjectSettingsButton.addEventListener(
  "click",
  () => {
    const project =
      getCurrentProject();

    if (!project) {
      return;
    }

    const name =
      settingsProjectName.value
        .trim();

    const description =
      settingsProjectDescription
        .value
        .trim();

    if (!name) {
      showToast(
        "Project name required"
      );

      return;
    }

    project.name = name;

    project.description =
      description ||
      "ApexCloud project.";

    saveProjects();

    render();

    showToast(
      "Project settings saved"
    );
  }
);

deleteProjectButton.addEventListener(
  "click",
  () => {
    const project =
      getCurrentProject();

    if (!project) {
      return;
    }

    const confirmed =
      window.confirm(
        `Delete "${project.name}"?\n\nThis removes the local v0.01 project from this browser.`
      );

    if (!confirmed) {
      return;
    }

    projects =
      projects.filter(
        (item) =>
          item.id !==
          project.id
      );

    currentProjectId =
      projects[0]?.id || null;

    currentView =
      "overview";

    saveProjects();
    saveCurrentProject();

    render();

    showToast(
      "Project deleted"
    );
  }
);

/* ----------------------------- */
/* RENDER */
/* ----------------------------- */

function renderProject() {
  const project =
    getCurrentProject();

  if (!project) {
    return;
  }

  project.tables ||=
    [];

  project.buckets ||=
    [];

  project.developmentKey ||=
    createPrototypeKey();

  projectSwitcherName.textContent =
    project.name;

  projectSwitcherRegion.textContent =
    project.region;

  projectSwitcherIcon.textContent =
    getProjectInitial(
      project.name
    );

  overviewProjectName.textContent =
    project.name;

  overviewProjectDescription.textContent =
    project.description;

  overviewProjectId.textContent =
    project.id;

  overviewCreatedAt.textContent =
    formatDate(
      project.createdAt
    );

  overviewRegion.textContent =
    project.region;

  databaseTableCount.textContent =
    project.tables.length;

  storageBucketCount.textContent =
    project.buckets.length;

  settingsProjectName.value =
    project.name;

  settingsProjectDescription.value =
    project.description;

  renderTables(project);
  renderBuckets(project);
  renderApi(project);

  switchView(currentView);
}

function render() {
  const project =
    getCurrentProject();

  emptyWorkspace.hidden =
    Boolean(project);

  projectWorkspace.hidden =
    !project;

  if (!project) {
    projectSwitcherName.textContent =
      "No project selected";

    projectSwitcherRegion.textContent =
      "ApexCloud";

    projectSwitcherIcon.textContent =
      "A";
  } else {
    renderProject();
  }

  renderProjectMenu();
}

/* ----------------------------- */
/* ESCAPE */
/* ----------------------------- */

document.addEventListener(
  "keydown",
  (event) => {
    if (event.key !== "Escape") {
      return;
    }

    if (
      !createProjectModal.hidden
    ) {
      closeProjectModal();

      return;
    }

    if (!resourceModal.hidden) {
      closeResourceModal();

      return;
    }

    projectMenu.hidden = true;

    closeSidebar();
  }
);

/* ----------------------------- */
/* START */
/* ----------------------------- */

loadProjects();
render();

console.log(
  "%cApexCloud v0.01",
  "color:#17c5df;font-size:16px;font-weight:bold;"
);

console.log(
  "Local prototype initialized."
);
