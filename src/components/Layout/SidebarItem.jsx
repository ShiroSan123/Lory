function SidebarItem({ icon, label }) {
	return (
		<div className="flex items-center p-2 mb-2 rounded-lg hover:bg-gray-100 cursor-pointer">
			<span className="text-xl mr-3">{icon}</span>
			<span>{label}</span>
		</div>
	);
}

export default SidebarItem;