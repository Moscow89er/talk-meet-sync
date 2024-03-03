import React, { useState } from 'react';
import { SettingsPopupProps } from '../../utils/types/commonTypes';

const SettingsPopup: React.FC<SettingsPopupProps> = ({ onSave, talkUrl: initialTalkUrl, apiKey: initialApiKey, numsOfLicense: initialNumsOfLicense }) => {
  // Создаем локальные состояния для временного хранения введенных данных
  const [tempTalkUrl, setTempTalkUrl] = useState(initialTalkUrl);
  const [tempApiKey, setTempApiKey] = useState(initialApiKey);
  const [tempNumsOfLicense, setTempNumsOfLicense] = useState(initialNumsOfLicense);

  // Обработчик нажатия на кнопку "Сохранить", который вызывает onSave с текущими значениями локальных состояний
  const handleSaveClick = () => {
    onSave(tempTalkUrl, tempApiKey, tempNumsOfLicense);
  };

  return (
    <>
      <div className="modal-body">
        <form>
          <div className="mb-3 fw-bold">
            <label htmlFor="talkUrl" className="form-label">Адрес пространства Толк</label>
            <input
              type="url"
              className="form-control"
              id="talkUrl"
              value={tempTalkUrl}
              onChange={(e) => setTempTalkUrl(e.target.value)}
              placeholder="Введите адрес пространства Толк"
            />
          </div>
          <div className="mb-3 fw-bold">
            <label htmlFor="apiKey" className="form-label">Ключ API</label>
            <input
              type="text"
              className="form-control"
              id="apiKey"
              value={tempApiKey}
              onChange={(e) => setTempApiKey(e.target.value)}
              placeholder="Введите ключ API"
            />
          </div>
          <div className="mb-3 fw-bold">
            <label htmlFor="numsOfLicense" className="form-label">Количество лицензий Толк</label>
            <input
              type="text"
              className="form-control"
              id="numsOfLicense"
              value={tempNumsOfLicense}
              onChange={(e) => setTempNumsOfLicense(Number(e.target.value))}
              placeholder="Введите количество приобретенных лицензий Толк"
            />
          </div>
        </form>
      </div>
      <div className="modal-footer">
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleSaveClick}
          disabled={!tempTalkUrl || !tempApiKey}
        >
          Сохранить
        </button>
      </div>
    </>
  );
};

export default SettingsPopup;
