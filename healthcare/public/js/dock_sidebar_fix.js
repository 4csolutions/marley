if (frappe.ui?.Sidebar?.prototype?.module_for_workspace) {
	const original_module_for_workspace = frappe.ui.Sidebar.prototype.module_for_workspace;

	/**
	 * Resolve a workspace name to its owning sidebar shell.
	 *
	 * Healthcare sidebars share `module: "Healthcare"`, so `sidebar.workspaces`
	 * overlaps across all Healthcare sidebars. Prefer an exact sidebar name match
	 * or an explicit Workspace link in `sidebar.items` before falling back to
	 * `sidebar.workspaces`.
	 */
	frappe.ui.Sidebar.prototype.module_for_workspace = function (name) {
		if (!name) return null;

		const sidebars = Object.values(frappe.boot.module_sidebars || {});

		const exact = sidebars.find((sidebar) => sidebar.name === name);
		if (exact) return exact.name;

		const linked = sidebars.find((sidebar) =>
			(sidebar.items || []).some(
				(item) => item.link_type === "Workspace" && item.link_to === name
			)
		);
		if (linked) return linked.name;

		return original_module_for_workspace.call(this, name);
	};
}
