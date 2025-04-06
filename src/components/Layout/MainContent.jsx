export function MainContent({ selectedMenu, isLoading = false }) {
	const renderMainContent = () => {
		switch (selectedMenu) {
			case 'Главная':
				return <h1>айаал</h1>
			case 'Канальная аналитика':
				return <h1>аналитика</h1>
			case 'Календарь броней':
				return <h1>календарь</h1>
			case 'Страны':
				return <h1>страна</h1>
			case 'Финансы':
				return <h1>финансы</h1>
			case 'Настройки':
				return <h1>настройки</h1>
			default:
				return <div>Выберите пункт меню</div>;
		}
	};

	return (
		<main
			className="fixed top-20 md:left-4 w-full rounded-2xl bg-white px-4 md:pt-2 md:px-6 md:ml-64 h-[calc(100vh-5rem)] overflow-y-auto"
		>
			<h1 className="text-xl sm:text-2xl font-bold mb-6">Дашборд</h1>
			{isLoading ? (
				<div>Loading...</div>
			) : (
				renderMainContent()
			)}
			{/* Charts */}
			{/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:w-[calc(100vw-20rem)]">
				{Array.from({ length: 20 }).map((_, index) => (
					<div className="bg-white p-6 rounded-lg shadow">
						<h1>hello</h1>
					</div>
				))}
			</div> */}
		</main >
	);
}

export default MainContent;