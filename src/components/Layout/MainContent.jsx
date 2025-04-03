function MainContent() {
	return (
		<main
			className="ml-64 mr-64 mt-16 p-6 h-[calc(100vh-4rem)] overflow-y-auto"
			style={{ backgroundColor: '#f5f7fa' }}
		>
			<h1 className="text-2xl font-bold mb-6">Дашборд</h1>

			{/* Metric Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
				<h1>hello</h1>
			</div>

			{/* Charts */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div className="bg-white p-6 rounded-lg shadow">
					<h1>hello</h1>
				</div>
				<div className="bg-white p-6 rounded-lg shadow">
					<h1>hello</h1>
				</div>
				<div className="bg-white p-6 rounded-lg shadow">
					<h1>hello</h1>
				</div>
			</div>
		</main>
	);
}

export default MainContent;