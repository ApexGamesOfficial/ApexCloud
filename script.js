const STORAGE_KEY = "apexCloudProjects";
const CURRENT_PROJECT_KEY = "apexCloudCurrentProject";

let projects = [];
let currentProjectId = null;
let currentView = "overview";

let resourceMode = null;
let selectedQueryId = null;
let selectedFunctionId = null;


/* =========================================================
   ELEMENT HELPERS
========================================================= */

const $ = (id) =>
  document.getElementById(id);

const sidebar = $("sidebar");
const sidebarOverlay = $("sidebarOverlay");
const mobileMenuButton = $("mobileMenuButton");
const sidebarCloseButton = $("sidebarCloseButton");
const homeButton = $("homeButton");

const emptyCreateButton =
  $("emptyCreateButton");

const projectSwitcher =
  $("projectSwitcher");

const projectSwitcherName =
  $("projectSwitcherName");

const projectSwitcherRegion =
  $("projectSwitcherRegion");

const projectSwitcherIcon =
  $("projectSwitcherIcon");

const projectMenu =
  $("projectMenu");

const projectMenuList =
  $("projectMenuList");

const projectMenuNewButton =
  $("projectMenuNewButton");

const emptyWorkspace =
  $("emptyWorkspace");

const projectWorkspace =
  $("projectWorkspace");

const breadcrumbCurrent =
  $("breadcrumbCurrent");

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


/* PROJECT MODAL */

const createProjectModal =
  $("createProjectModal");

const createProjectForm =
  $("createProjectForm");

const closeProjectModalButton =
  $("closeProjectModalButton");

const cancelCreateProjectButton =
  $("cancelCreateProjectButton");

const projectNameInput =
  $("projectNameInput");

const projectDescriptionInput =
  $("projectDescriptionInput");

const projectRegionInput =
  $("projectRegionInput");


/* OVERVIEW */

const overviewProjectName =
  $("overviewProjectName");

const overviewProjectDescription =
  $("overviewProjectDescription");

const overviewProjectId =
  $("overviewProjectId");

const overviewCreatedAt =
  $("overviewCreatedAt");

const overviewRegion =
  $("overviewRegion");

const databaseTableCount =
  $("databaseTableCount");

const storageBucketCount =
  $("storageBucketCount");

const functionCount =
  $("functionCount");


/* TABLES */

const createTableButton =
  $("createTableButton");

const databaseTableList =
  $("databaseTableList");

const databaseEmpty =
  $("databaseEmpty");


/* STORAGE */

const createBucketButton =
  $("createBucketButton");

const storageBucketList =
  $("storageBucketList");

const storageEmpty =
  $("storageEmpty");


/* RESOURCE MODAL */

const resourceModal =
  $("resourceModal");

const resourceModalEyebrow =
  $("resourceModalEyebrow");

const resourceModalTitle =
  $("resourceModalTitle");

const closeResourceModalButton =
  $("closeResourceModalButton");

const cancelResourceButton =
  $("cancelResourceButton");

const resourceForm =
  $("resourceForm");

const resourceNameInput =
  $("resourceNameInput");

const resourceSubmitButton =
  $("resourceSubmitButton");


/* SQL */

const sqlEditor =
  $("sqlEditor");

const sqlLineNumbers =
  $("sqlLineNumbers");

const sqlQueryName =
  $("sqlQueryName");

const newQueryButton =
  $("newQueryButton");

const saveQueryButton =
  $("saveQueryButton");

const runQueryButton =
  $("runQueryButton");

const savedQueryList =
  $("savedQueryList");

const queryHistoryList =
  $("queryHistoryList");

const clearQueryHistoryButton =
  $("clearQueryHistoryButton");

const sqlOutput =
  $("sqlOutput");

const sqlExecutionMeta =
  $("sqlExecutionMeta");


/* SCHEMA */

const schemaGrid =
  $("schemaGrid");

const schemaTableCount =
  $("schemaTableCount");


/* FUNCTIONS */

const createFunctionButton =
  $("createFunctionButton");

const functionsEmpty =
  $("functionsEmpty");

const functionList =
  $("functionList");

const functionsBadge =
  $("functionsBadge");

const functionEditorPanel =
  $("functionEditorPanel");

const functionNameInput =
  $("functionNameInput");

const functionEnabledInput =
  $("functionEnabledInput");

const functionCodeInput =
  $("functionCodeInput");

const saveFunctionButton =
  $("saveFunctionButton");

const deleteFunctionButton =
  $("deleteFunctionButton");

const functionModal =
  $("functionModal");

const functionForm =
  $("functionForm");

const newFunctionNameInput =
  $("newFunctionNameInput");

const closeFunctionModalButton =
  $("closeFunctionModalButton");

const cancelFunctionButton =
  $("cancelFunctionButton");


/* API */

const apiProjectUrl =
  $("apiProjectUrl");

const apiProjectKey =
  $("apiProjectKey");

const apiExample =
  $("apiExample");

const copyApiUrlButton =
  $("copyApiUrlButton");

const copyApiKeyButton =
  $("copyApiKeyButton");


/* BACKUPS */

const createBackupButton =
  $("createBackupButton");

const backupList =
  $("backupList");

const backupsEmpty =
  $("backupsEmpty");

const backupCountBadge =
  $("backupCountBadge");


/* SETTINGS */

const settingsProjectName =
  $("settingsProjectName");

const settingsProjectDescription =
  $("settingsProjectDescription");

const saveProjectSettingsButton =
  $("saveProjectSettingsButton");

const deleteProjectButton =
  $("deleteProjectButton");


const toast = $("toast");


/* =========================================================
   DATA
========================================================= */

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

    migrateProjects();

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


function migrateProjects() {

  let changed = false;

  projects.forEach(
    (project) => {

      if (!project.tables) {
        project.tables = [];
        changed = true;
      }

      if (!project.buckets) {
        project.buckets = [];
        changed = true;
      }

      if (!project.savedQueries) {
        project.savedQueries = [];
        changed = true;
      }

      if (!project.queryHistory) {
        project.queryHistory = [];
        changed = true;
      }

      if (!project.functions) {
        project.functions = [];
        changed = true;
      }

      if (!project.backups) {
        project.backups = [];
        changed = true;
      }

      if (!project.developmentKey) {
        project.developmentKey =
          createPrototypeKey();

        changed = true;
      }

    }
  );

  if (changed) {
    saveProjects();
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


/* =========================================================
   HELPERS
========================================================= */

function makeId(
  prefix = "prj"
) {

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


function formatDate(
  value
) {

  return new Date(
    value
  ).toLocaleDateString(
    undefined,
    {
      year: "numeric",
      month: "short",
      day: "numeric"
    }
  );

}


function formatDateTime(
  value
) {

  return new Date(
    value
  ).toLocaleString(
    undefined,
    {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit"
    }
  );

}


function getProjectInitial(
  name
) {

  return (
    name.trim().charAt(0) ||
    "A"
  ).toUpperCase();

}


function escapeHtml(
  value
) {

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


/* =========================================================
   TOAST
========================================================= */

let toastTimer;

function showToast(
  message
) {

  clearTimeout(
    toastTimer
  );

  toast.textContent =
    message;

  toast.hidden = false;

  toastTimer =
    setTimeout(
      () => {
        toast.hidden = true;
      },
      1800
    );

}


/* =========================================================
   SIDEBAR
========================================================= */

function openSidebar() {

  sidebar.classList.add(
    "open"
  );

  sidebarOverlay.classList.add(
    "visible"
  );

}


function closeSidebar() {

  sidebar.classList.remove(
    "open"
  );

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


/* =========================================================
   CREATE PROJECT
========================================================= */

function openProjectModal() {

  projectMenu.hidden = true;

  createProjectForm.reset();

  projectRegionInput.value =
    "US East";

  createProjectModal.hidden =
    false;

  requestAnimationFrame(
    () =>
      projectNameInput.focus()
  );

}


function closeProjectModal() {

  createProjectModal.hidden =
    true;

}


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


createProjectForm.addEventListener(
  "submit",
  (event) => {

    event.preventDefault();

    const name =
      projectNameInput.value.trim();

    if (!name) {
      return;
    }

    const project = {

      id: makeId("prj"),

      name,

      description:
        projectDescriptionInput.value
          .trim() ||
        "ApexCloud project.",

      region:
        projectRegionInput.value,

      createdAt:
        new Date().toISOString(),

      developmentKey:
        createPrototypeKey(),

      tables: [],
      buckets: [],
      savedQueries: [],
      queryHistory: [],
      functions: [],
      backups: []

    };

    projects.unshift(
      project
    );

    currentProjectId =
      project.id;

    currentView =
      "overview";

    saveProjects();
    saveCurrentProject();

    closeProjectModal();

    render();

    showToast(
      `${project.name} created`
    );

  }
);


/* =========================================================
   PROJECT SWITCHER
========================================================= */

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

  projectMenuList.innerHTML =
    "";

  if (!projects.length) {

    projectMenuList.innerHTML =
      `<div class="project-menu-heading">
        No projects yet.
      </div>`;

    return;

  }

  projects.forEach(
    (project) => {

      const button =
        document.createElement(
          "button"
        );

      button.type =
        "button";

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

      button.innerHTML = `
        <span class="project-menu-item-icon">
          ${escapeHtml(
            getProjectInitial(
              project.name
            )
          )}
        </span>

        <span class="project-menu-item-copy">
          <strong>
            ${escapeHtml(project.name)}
          </strong>
          <span>
            ${escapeHtml(project.region)}
          </span>
        </span>
      `;

      button.addEventListener(
        "click",
        () => {

          currentProjectId =
            project.id;

          currentView =
            "overview";

          selectedQueryId =
            null;

          selectedFunctionId =
            null;

          saveCurrentProject();

          projectMenu.hidden =
            true;

          render();

        }
      );

      projectMenuList.appendChild(
        button
      );

    }
  );

}


/* =========================================================
   NAVIGATION
========================================================= */

const VIEW_LABELS = {
  overview: "Overview",
  database: "Table Editor",
  sql: "SQL Editor",
  schema: "Schema",
  storage: "Storage",
  functions: "Functions",
  api: "API",
  backups: "Backups",
  settings: "Settings"
};


function switchView(
  viewName
) {

  if (!getCurrentProject()) {
    return;
  }

  currentView =
    viewName;

  navItems.forEach(
    (item) => {

      item.classList.toggle(
        "active",
        item.dataset.view ===
          viewName
      );

    }
  );

  viewPanels.forEach(
    (panel) => {

      panel.classList.toggle(
        "active-view",
        panel.dataset.viewPanel ===
          viewName
      );

    }
  );

  breadcrumbCurrent.textContent =
    VIEW_LABELS[viewName] ||
    "Project";

  closeSidebar();

}


navItems.forEach(
  (item) => {

    item.addEventListener(
      "click",
      () => {

        switchView(
          item.dataset.view
        );

      }
    );

  }
);


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


/* =========================================================
   RESOURCE MODAL
========================================================= */

function openResourceModal(
  mode
) {

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

  requestAnimationFrame(
    () =>
      resourceNameInput.focus()
  );

}


function closeResourceModal() {

  resourceModal.hidden = true;
  resourceMode = null;

}


createTableButton.addEventListener(
  "click",
  () =>
    openResourceModal(
      "table"
    )
);

createBucketButton.addEventListener(
  "click",
  () =>
    openResourceModal(
      "bucket"
    )
);

closeResourceModalButton.addEventListener(
  "click",
  closeResourceModal
);

cancelResourceButton.addEventListener(
  "click",
  closeResourceModal
);


resourceForm.addEventListener(
  "submit",
  (event) => {

    event.preventDefault();

    const project =
      getCurrentProject();

    const name =
      resourceNameInput.value
        .trim();

    if (
      !project ||
      !name
    ) {
      return;
    }

    if (
      resourceMode ===
      "table"
    ) {

      const duplicate =
        project.tables.some(
          (table) =>
            table.name
              .toLowerCase() ===
            name.toLowerCase()
        );

      if (duplicate) {

        showToast(
          "Table already exists"
        );

        return;

      }

      project.tables.push({
        id: makeId("tbl"),
        name,
        createdAt:
          new Date().toISOString(),
        columns: []
      });

      showToast(
        `Table "${name}" created`
      );

    }


    if (
      resourceMode ===
      "bucket"
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


/* =========================================================
   TABLES
========================================================= */

function renderTables(
  project
) {

  const tables =
    project.tables || [];

  databaseTableList.innerHTML =
    "";

  databaseEmpty.hidden =
    tables.length > 0;

  databaseTableList.hidden =
    tables.length === 0;

  tables.forEach(
    (table) => {

      const row =
        document.createElement(
          "div"
        );

      row.className =
        "resource-row";

      row.innerHTML = `
        <span class="resource-icon">
          ▦
        </span>

        <span class="resource-copy">
          <strong>
            ${escapeHtml(table.name)}
          </strong>

          <span>
            Created
            ${escapeHtml(
              formatDate(
                table.createdAt
              )
            )}
          </span>
        </span>

        <span class="resource-tag">
          TABLE
        </span>
      `;

      databaseTableList.appendChild(
        row
      );

    }
  );

}


/* =========================================================
   STORAGE
========================================================= */

function renderBuckets(
  project
) {

  const buckets =
    project.buckets || [];

  storageBucketList.innerHTML =
    "";

  storageEmpty.hidden =
    buckets.length > 0;

  storageBucketList.hidden =
    buckets.length === 0;

  buckets.forEach(
    (bucket) => {

      const row =
        document.createElement(
          "div"
        );

      row.className =
        "resource-row";

      row.innerHTML = `
        <span class="resource-icon">
          ▣
        </span>

        <span class="resource-copy">
          <strong>
            ${escapeHtml(bucket.name)}
          </strong>

          <span>
            Created
            ${escapeHtml(
              formatDate(
                bucket.createdAt
              )
            )}
          </span>
        </span>

        <span class="resource-tag">
          BUCKET
        </span>
      `;

      storageBucketList.appendChild(
        row
      );

    }
  );

}


/* =========================================================
   SQL EDITOR
========================================================= */

function updateSqlLineNumbers() {

  const count =
    Math.max(
      1,
      sqlEditor.value
        .split("\n")
        .length
    );

  sqlLineNumbers.textContent =
    Array.from(
      {
        length: count
      },
      (_, index) =>
        index + 1
    ).join("\n");

}


sqlEditor.addEventListener(
  "input",
  updateSqlLineNumbers
);


newQueryButton.addEventListener(
  "click",
  () => {

    selectedQueryId = null;

    sqlQueryName.value =
      "Untitled query";

    sqlEditor.value =
      "";

    sqlExecutionMeta.textContent =
      "Not executed";

    sqlOutput.innerHTML = `
      <div class="sql-output-empty">
        Run a query to view execution output.
      </div>
    `;

    updateSqlLineNumbers();

    renderSavedQueries(
      getCurrentProject()
    );

    sqlEditor.focus();

  }
);


saveQueryButton.addEventListener(
  "click",
  () => {

    const project =
      getCurrentProject();

    if (!project) {
      return;
    }

    const name =
      sqlQueryName.value.trim() ||
      "Untitled query";

    const sql =
      sqlEditor.value;

    if (selectedQueryId) {

      const query =
        project.savedQueries.find(
          (item) =>
            item.id ===
            selectedQueryId
        );

      if (query) {

        query.name = name;
        query.sql = sql;
        query.updatedAt =
          new Date().toISOString();

      }

    } else {

      const query = {
        id: makeId("qry"),
        name,
        sql,
        createdAt:
          new Date().toISOString(),
        updatedAt:
          new Date().toISOString()
      };

      project.savedQueries.unshift(
        query
      );

      selectedQueryId =
        query.id;

    }

    saveProjects();

    renderSavedQueries(
      project
    );

    showToast(
      "Query saved"
    );

  }
);


runQueryButton.addEventListener(
  "click",
  () => {

    const project =
      getCurrentProject();

    if (!project) {
      return;
    }

    const sql =
      sqlEditor.value.trim();

    if (!sql) {

      showToast(
        "Enter a SQL query"
      );

      return;

    }

    const started =
      performance.now();

    const historyItem = {
      id: makeId("run"),
      sql,
      executedAt:
        new Date().toISOString(),
      status:
        "prototype"
    };

    project.queryHistory.unshift(
      historyItem
    );

    project.queryHistory =
      project.queryHistory.slice(
        0,
        50
      );

    saveProjects();

    const elapsed =
      Math.max(
        1,
        Math.round(
          performance.now() -
          started
        )
      );

    sqlExecutionMeta.textContent =
      `${elapsed}ms · prototype`;

    sqlOutput.innerHTML = `
      <div class="sql-output-message warning">
        SQL execution is not connected to a
        database engine yet. The query was added
        to local history but was not executed
        against a live database.
      </div>
    `;

    renderQueryHistory(
      project
    );

  }
);


clearQueryHistoryButton.addEventListener(
  "click",
  () => {

    const project =
      getCurrentProject();

    if (!project) {
      return;
    }

    project.queryHistory = [];

    saveProjects();

    renderQueryHistory(
      project
    );

    showToast(
      "Query history cleared"
    );

  }
);


function renderSavedQueries(
  project
) {

  savedQueryList.innerHTML =
    "";

  if (
    !project.savedQueries.length
  ) {

    savedQueryList.innerHTML = `
      <div class="sql-output-empty"
           style="padding:12px;">
        No saved queries.
      </div>
    `;

    return;

  }

  project.savedQueries.forEach(
    (query) => {

      const button =
        document.createElement(
          "button"
        );

      button.type =
        "button";

      button.className =
        "saved-query-item";

      if (
        query.id ===
        selectedQueryId
      ) {

        button.classList.add(
          "active"
        );

      }

      button.innerHTML = `
        <strong>
          ${escapeHtml(query.name)}
        </strong>

        <span>
          ${escapeHtml(
            formatDateTime(
              query.updatedAt
            )
          )}
        </span>
      `;

      button.addEventListener(
        "click",
        () => {

          selectedQueryId =
            query.id;

          sqlQueryName.value =
            query.name;

          sqlEditor.value =
            query.sql;

          updateSqlLineNumbers();

          renderSavedQueries(
            project
          );

        }
      );

      savedQueryList.appendChild(
        button
      );

    }
  );

}


function renderQueryHistory(
  project
) {

  queryHistoryList.innerHTML =
    "";

  if (
    !project.queryHistory.length
  ) {

    queryHistoryList.innerHTML = `
      <div class="sql-output-empty"
           style="padding:14px;">
        No query history yet.
      </div>
    `;

    return;

  }

  project.queryHistory.forEach(
    (item) => {

      const row =
        document.createElement(
          "div"
        );

      row.className =
        "history-item";

      row.innerHTML = `
        <code>
          ${escapeHtml(item.sql)}
        </code>

        <span>
          ${escapeHtml(
            formatDateTime(
              item.executedAt
            )
          )}
        </span>
      `;

      queryHistoryList.appendChild(
        row
      );

    }
  );

}


/* =========================================================
   SCHEMA
========================================================= */

function renderSchema(
  project
) {

  const tables =
    project.tables || [];

  schemaTableCount.textContent =
    `${tables.length} ${
      tables.length === 1
        ? "TABLE"
        : "TABLES"
    }`;

  schemaGrid.innerHTML =
    "";

  if (!tables.length) {

    schemaGrid.innerHTML = `
      <div class="schema-empty">
        No database tables yet.
        Create a table in Table Editor
        and it will appear here.
      </div>
    `;

    return;

  }

  tables.forEach(
    (table) => {

      const card =
        document.createElement(
          "article"
        );

      card.className =
        "schema-card";

      const columns =
        table.columns || [];

      card.innerHTML = `
        <div class="schema-card-header">
          <strong>
            ${escapeHtml(table.name)}
          </strong>

          <span class="resource-tag">
            TABLE
          </span>
        </div>

        <div class="schema-card-body">

          ${
            columns.length
              ? columns.map(
                  (column) => `
                    <div class="schema-placeholder-column">
                      <span>
                        ${escapeHtml(
                          column.name
                        )}
                      </span>

                      <span>
                        ${escapeHtml(
                          column.type ||
                          "text"
                        )}
                      </span>
                    </div>
                  `
                ).join("")
              : `
                <div class="schema-placeholder-column">
                  <span>
                    No columns defined
                  </span>

                  <span>
                    —
                  </span>
                </div>
              `
          }

        </div>
      `;

      schemaGrid.appendChild(
        card
      );

    }
  );

}


/* =========================================================
   FUNCTIONS
========================================================= */

function openFunctionModal() {

  functionForm.reset();

  functionModal.hidden =
    false;

  requestAnimationFrame(
    () =>
      newFunctionNameInput.focus()
  );

}


function closeFunctionModal() {

  functionModal.hidden =
    true;

}


createFunctionButton.addEventListener(
  "click",
  openFunctionModal
);

closeFunctionModalButton.addEventListener(
  "click",
  closeFunctionModal
);

cancelFunctionButton.addEventListener(
  "click",
  closeFunctionModal
);


functionForm.addEventListener(
  "submit",
  (event) => {

    event.preventDefault();

    const project =
      getCurrentProject();

    const name =
      newFunctionNameInput.value
        .trim();

    if (
      !project ||
      !name
    ) {
      return;
    }

    const duplicate =
      project.functions.some(
        (fn) =>
          fn.name.toLowerCase() ===
          name.toLowerCase()
      );

    if (duplicate) {

      showToast(
        "Function already exists"
      );

      return;

    }

    const fn = {

      id: makeId("fn"),

      name,

      enabled: true,

      code:
`export default async function handler(request) {
  return {
    message: "Hello from ApexCloud"
  };
}`,

      createdAt:
        new Date().toISOString(),

      updatedAt:
        new Date().toISOString()

    };

    project.functions.unshift(
      fn
    );

    selectedFunctionId =
      fn.id;

    saveProjects();

    closeFunctionModal();

    renderFunctions(
      project
    );

    showToast(
      `Function "${name}" created`
    );

  }
);


function selectFunction(
  id
) {

  selectedFunctionId = id;

  renderFunctions(
    getCurrentProject()
  );

}


saveFunctionButton.addEventListener(
  "click",
  () => {

    const project =
      getCurrentProject();

    const fn =
      project?.functions.find(
        (item) =>
          item.id ===
          selectedFunctionId
      );

    if (!fn) {
      return;
    }

    const name =
      functionNameInput.value
        .trim();

    if (!name) {

      showToast(
        "Function name required"
      );

      return;

    }

    fn.name = name;

    fn.enabled =
      functionEnabledInput.checked;

    fn.code =
      functionCodeInput.value;

    fn.updatedAt =
      new Date().toISOString();

    saveProjects();

    renderFunctions(
      project
    );

    showToast(
      "Function saved"
    );

  }
);


deleteFunctionButton.addEventListener(
  "click",
  () => {

    const project =
      getCurrentProject();

    const fn =
      project?.functions.find(
        (item) =>
          item.id ===
          selectedFunctionId
      );

    if (!fn) {
      return;
    }

    const confirmed =
      window.confirm(
        `Delete function "${fn.name}"?`
      );

    if (!confirmed) {
      return;
    }

    project.functions =
      project.functions.filter(
        (item) =>
          item.id !== fn.id
      );

    selectedFunctionId =
      project.functions[0]?.id ||
      null;

    saveProjects();

    renderFunctions(
      project
    );

    showToast(
      "Function deleted"
    );

  }
);


function renderFunctions(
  project
) {

  const functions =
    project.functions || [];

  functionCount.textContent =
    functions.length;

  functionsBadge.textContent =
    `${functions.length} ${
      functions.length === 1
        ? "FUNCTION"
        : "FUNCTIONS"
    }`;

  functionsEmpty.hidden =
    functions.length > 0;

  functionList.innerHTML =
    "";

  if (
    selectedFunctionId &&
    !functions.some(
      (fn) =>
        fn.id ===
        selectedFunctionId
    )
  ) {

    selectedFunctionId =
      null;

  }

  if (
    !selectedFunctionId &&
    functions.length
  ) {

    selectedFunctionId =
      functions[0].id;

  }

  functions.forEach(
    (fn) => {

      const button =
        document.createElement(
          "button"
        );

      button.type =
        "button";

      button.className =
        "function-list-item";

      if (
        fn.id ===
        selectedFunctionId
      ) {

        button.classList.add(
          "active"
        );

      }

      button.innerHTML = `
        <span class="function-list-copy">
          <strong>
            ${escapeHtml(fn.name)}
          </strong>

          <span>
            Updated
            ${escapeHtml(
              formatDateTime(
                fn.updatedAt
              )
            )}
          </span>
        </span>

        <span class="
          function-state
          ${fn.enabled ? "" : "disabled"}
        ">
          ${fn.enabled
            ? "Enabled"
            : "Disabled"}
        </span>
      `;

      button.addEventListener(
        "click",
        () =>
          selectFunction(
            fn.id
          )
      );

      functionList.appendChild(
        button
      );

    }
  );


  const selected =
    functions.find(
      (fn) =>
        fn.id ===
        selectedFunctionId
    );

  functionEditorPanel.hidden =
    !selected;

  if (!selected) {
    return;
  }

  functionNameInput.value =
    selected.name;

  functionEnabledInput.checked =
    selected.enabled;

  functionCodeInput.value =
    selected.code;

}


/* =========================================================
   API
========================================================= */

function renderApi(
  project
) {

  const slug =
    project.id
      .replace(
        "prj_",
        ""
      )
      .toLowerCase();

  /*
     IMPORTANT:
     This is a displayed DEVELOPMENT PLACEHOLDER,
     not a live ApexCloud backend yet.
  */

  const url =
    `https://api.apexcloud.dev/v1/${slug}`;

  apiProjectUrl.textContent =
    url;

  apiProjectKey.textContent =
    project.developmentKey;

  apiExample.textContent =
`// ApexCloud v0.01 development example

fetch("${url}/data", {
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

    await navigator.clipboard
      .writeText(
        value
      );

    showToast(
      successMessage
    );

  } catch {

    showToast(
      "Unable to copy"
    );

  }

}


copyApiUrlButton.addEventListener(
  "click",
  () => {

    copyText(
      apiProjectUrl.textContent,
      "Development endpoint copied"
    );

  }
);


copyApiKeyButton.addEventListener(
  "click",
  () => {

    copyText(
      apiProjectKey.textContent,
      "Development key copied"
    );

  }
);


/* =========================================================
   BACKUPS
========================================================= */

createBackupButton.addEventListener(
  "click",
  () => {

    const project =
      getCurrentProject();

    if (!project) {
      return;
    }

    /*
      Avoid recursively placing old backups
      inside every new backup.
    */

    const snapshot =
      structuredClone
        ? structuredClone(project)
        : JSON.parse(
            JSON.stringify(project)
          );

    snapshot.backups = [];

    const backup = {

      id: makeId("bak"),

      createdAt:
        new Date().toISOString(),

      snapshot

    };

    project.backups.unshift(
      backup
    );

    saveProjects();

    renderBackups(
      project
    );

    showToast(
      "Project backup created"
    );

  }
);


function restoreBackup(
  backupId
) {

  const project =
    getCurrentProject();

  const backup =
    project?.backups.find(
      (item) =>
        item.id ===
        backupId
    );

  if (!backup) {
    return;
  }

  const confirmed =
    window.confirm(
      "Restore this backup?\n\nCurrent project data will be replaced by the snapshot."
    );

  if (!confirmed) {
    return;
  }

  const preservedBackups =
    project.backups;

  const restored =
    JSON.parse(
      JSON.stringify(
        backup.snapshot
      )
    );

  restored.backups =
    preservedBackups;

  const index =
    projects.findIndex(
      (item) =>
        item.id ===
        project.id
    );

  projects[index] =
    restored;

  currentProjectId =
    restored.id;

  selectedQueryId =
    null;

  selectedFunctionId =
    null;

  saveProjects();
  saveCurrentProject();

  render();

  switchView(
    "backups"
  );

  showToast(
    "Backup restored"
  );

}


function deleteBackup(
  backupId
) {

  const project =
    getCurrentProject();

  if (!project) {
    return;
  }

  project.backups =
    project.backups.filter(
      (backup) =>
        backup.id !==
        backupId
    );

  saveProjects();

  renderBackups(
    project
  );

  showToast(
    "Backup deleted"
  );

}


function renderBackups(
  project
) {

  const backups =
    project.backups || [];

  backupCountBadge.textContent =
    `${backups.length} ${
      backups.length === 1
        ? "BACKUP"
        : "BACKUPS"
    }`;

  backupsEmpty.hidden =
    backups.length > 0;

  backupList.innerHTML =
    "";

  backups.forEach(
    (backup, index) => {

      const row =
        document.createElement(
          "div"
        );

      row.className =
        "backup-row";

      row.innerHTML = `
        <span class="backup-copy">
          <strong>
            Backup ${backups.length - index}
          </strong>

          <span>
            ${escapeHtml(
              formatDateTime(
                backup.createdAt
              )
            )}
          </span>
        </span>

        <span class="backup-actions">

          <button
            class="secondary-button compact-button"
            data-restore
          >
            Restore
          </button>

          <button
            class="danger-text-button"
            data-delete
          >
            Delete
          </button>

        </span>
      `;

      row
        .querySelector(
          "[data-restore]"
        )
        .addEventListener(
          "click",
          () =>
            restoreBackup(
              backup.id
            )
        );

      row
        .querySelector(
          "[data-delete]"
        )
        .addEventListener(
          "click",
          () =>
            deleteBackup(
              backup.id
            )
        );

      backupList.appendChild(
        row
      );

    }
  );

}


/* =========================================================
   SETTINGS
========================================================= */

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

    if (!name) {

      showToast(
        "Project name required"
      );

      return;

    }

    project.name = name;

    project.description =
      settingsProjectDescription
        .value
        .trim() ||
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
        `Delete "${project.name}"?\n\nThis removes the local ApexCloud project from this browser.`
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
      projects[0]?.id ||
      null;

    currentView =
      "overview";

    selectedQueryId =
      null;

    selectedFunctionId =
      null;

    saveProjects();
    saveCurrentProject();

    render();

    showToast(
      "Project deleted"
    );

  }
);


/* =========================================================
   RENDER PROJECT
========================================================= */

function renderProject() {

  const project =
    getCurrentProject();

  if (!project) {
    return;
  }

  project.tables ||= [];
  project.buckets ||= [];
  project.savedQueries ||= [];
  project.queryHistory ||= [];
  project.functions ||= [];
  project.backups ||= [];

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

  functionCount.textContent =
    project.functions.length;


  settingsProjectName.value =
    project.name;

  settingsProjectDescription.value =
    project.description;


  renderTables(project);
  renderBuckets(project);

  renderSavedQueries(project);
  renderQueryHistory(project);

  renderSchema(project);
  renderFunctions(project);

  renderApi(project);
  renderBackups(project);

  updateSqlLineNumbers();

  switchView(
    currentView
  );

}


/* =========================================================
   MAIN RENDER
========================================================= */

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

    breadcrumbCurrent.textContent =
      "Project";

  } else {

    renderProject();

  }

  renderProjectMenu();

}


/* =========================================================
   MODAL BACKDROPS
========================================================= */

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


functionModal.addEventListener(
  "click",
  (event) => {

    if (
      event.target ===
      functionModal
    ) {

      closeFunctionModal();

    }

  }
);


/* =========================================================
   ESCAPE
========================================================= */

document.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key !==
      "Escape"
    ) {
      return;
    }

    if (
      !createProjectModal.hidden
    ) {

      closeProjectModal();
      return;

    }

    if (
      !resourceModal.hidden
    ) {

      closeResourceModal();
      return;

    }

    if (
      !functionModal.hidden
    ) {

      closeFunctionModal();
      return;

    }

    projectMenu.hidden =
      true;

    closeSidebar();

  }
);


/* =========================================================
   START
========================================================= */

loadProjects();

render();

updateSqlLineNumbers();

console.log(
  "%cApexCloud v0.01",
  "color:#22c7e6;font-size:16px;font-weight:bold;"
);

console.log(
  "Developer console initialized."
);
