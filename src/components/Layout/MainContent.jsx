export function MainContent() {
	return (
		<main
			className="pt-16 px-4 sm:px-6 md:ml-64 md:mr-64 h-[calc(100vh-4rem)] overflow-y-auto"
			style={{ backgroundColor: '#f5f7fa' }}
		>
			<h1 className="text-xl sm:text-2xl font-bold mb-6">Дашборд</h1>

			{/* Charts */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{Array.from({ length: 20 }).map((_, index) => (
					<div className="bg-white p-6 rounded-lg shadow">
						<h1>hello</h1>
					</div>
				))}
			</div>
		</main >
	);
}

export default MainContent;