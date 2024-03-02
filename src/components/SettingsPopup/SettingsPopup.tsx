import React, { useState } from 'react';

const SettingsPopup: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [apiUrl, setApiUrl] = useState('');
  const [apiKey, setApiKey] = useState('');

  const handleSave = () => {
    // Создание экземпляра MainApi с новым URL
    // const mainApi = new MainApi({ url: apiUrl });

    // Сохранение ключа API в localStorage
    localStorage.setItem('apiKey', apiKey);

    // Обновление заголовков запроса или другой логики, связанной с apiKey
    // ...

    onClose(); // Закрытие попапа после сохранения настроек
  };

  return (
    <div className="modal show" tabIndex={-1}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Настройки</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form>
              <div className="mb-3">
                <label htmlFor="apiUrl" className="form-label">Адрес API</label>
                <input
                  type="url"
                  className="form-control"
                  id="apiUrl"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  placeholder="Введите адрес API"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="apiKey" className="form-label">Ключ API</label>
                <input
                  type="text"
                  className="form-control"
                  id="apiKey"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Введите ключ API"
                />
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className={`btn btn-primary ${!apiUrl || !apiKey ? 'disabled' : ''}`}
              onClick={handleSave}
              disabled={!apiUrl || !apiKey}
            >
              Сохранить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPopup;