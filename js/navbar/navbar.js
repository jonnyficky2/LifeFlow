export function initSidebar() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebarOverlay");
  const toggle = document.getElementById("sidebarToggle");
  const closeBtn = document.getElementById("sidebarClose");
  const sidebarItems = document.querySelectorAll(".sidebar-item");

  const openSidebar = () => {
    sidebar?.classList.add("sidebar-open");
    overlay?.classList.add("sidebar-overlay-show");
  };

  const closeSidebar = () => {
    sidebar?.classList.remove("sidebar-open");
    overlay?.classList.remove("sidebar-overlay-show");
  };

  toggle?.addEventListener("click", openSidebar);
  closeBtn?.addEventListener("click", closeSidebar);
  overlay?.addEventListener("click", closeSidebar);
  sidebarItems.forEach((item) => {
    item.addEventListener("click", closeSidebar);
  });
}
