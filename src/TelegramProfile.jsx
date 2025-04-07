import { useTelegram } from './context/TelegramContext';

const TelegramProfile = () => {
  const { userData } = useTelegram();
  
  if (!userData || !userData.user) {
    return (
      <div>
        <h2>Нет данных пользователя</h2>
        <p>Убедитесь, что приложение запущено через Telegram и данные корректно переданы.</p>
      </div>
    );
  }

  const { user, hash } = userData;

  return (
    <div>
      <button onClick={() => alert(JSON.stringify(userData, null, 2))}>info</button>
      <h1>Профиль пользователя Telegram</h1>
      <p><strong>ID:</strong> {user.id}</p>
      <p><strong>Имя:</strong> {user.first_name}</p>
      <p><strong>Фамилия:</strong> {user.last_name}</p>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Язык:</strong> {user.language_code}</p>
      {hash && (
        <p>
          <strong>Telegram Hash Token:</strong> {hash}
        </p>
      )}
    </div>
  );
};

export default TelegramProfile;
