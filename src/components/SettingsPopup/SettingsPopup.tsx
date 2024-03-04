import React, { FormEvent, useState } from "react";
import { SettingsPopupProps } from "../../utils/types/commonTypes";

const SettingsPopup: React.FC<SettingsPopupProps> = ({
  onSave,
  talkUrl: initialTalkUrl,
  apiKey: initialApiKey,
  numsOfLicense: initialNumsOfLicense,
  onDelete
}) => {
  // Создаем локальные состояния для временного хранения введенных данных
  const [tempTalkUrl, setTempTalkUrl] = useState(initialTalkUrl);
  const [tempApiKey, setTempApiKey] = useState(initialApiKey);
  const [tempNumsOfLicense, setTempNumsOfLicense] = useState(initialNumsOfLicense);

  // Обработчик нажатия на кнопку "Сохранить", который вызывает onSave с текущими значениями локальных состояний
  const handleSave = (event: FormEvent) => {
    event.preventDefault(); // Предотвращаем стандартное поведение формы
    onSave(tempTalkUrl, tempApiKey, tempNumsOfLicense);
  };

  const handleDelete = (event: FormEvent) => {
    event.preventDefault();
    onDelete();
  };

  return (
    <>
      <div className="modal-body">
        <form onSubmit={handleSave}>
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
          <div className="modal-footer d-flex justify-content-between">
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleDelete}
              disabled={!localStorage.getItem("talkUrl") || !localStorage.getItem("apiKey")}
            >
              Удалить данные
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!tempTalkUrl || !tempApiKey}
            >
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default SettingsPopup;