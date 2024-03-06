import React, { FormEvent, useState } from "react";
import { SettingsPopupProps } from "../../utils/types/commonTypes";
import FormField from "../FormField/FormField";

const SettingsPopup: React.FC<SettingsPopupProps> = ({
  onSave,
  talkUrl: initialTalkUrl,
  apiKey: initialApiKey,
  numsOfLicense: initialNumsOfLicense,
  onDelete
}) => {
  // Создаем локальные состояния для временного хранения введенных данных
  const [tempTalkUrl, setTempTalkUrl] = useState<string>(initialTalkUrl);
  const [tempApiKey, setTempApiKey] = useState<string>(initialApiKey);
  const [tempNumsOfLicense, setTempNumsOfLicense] = useState<number | string>(initialNumsOfLicense);

  // Обработчик нажатия на кнопку "Сохранить", который вызывает onSave с текущими значениями локальных состояний
  const handleSave = (event: FormEvent) => {
    event.preventDefault(); // Предотвращаем стандартное поведение формы

    // Автоматическая корректировка URL
    let correctedTalkUrl = tempTalkUrl;
    if (!correctedTalkUrl.endsWith('/')) {
      correctedTalkUrl += '/';
    }

    const numsOfLicenseAsNumber = parseInt(tempNumsOfLicense.toString(), 10);
    onSave(correctedTalkUrl, tempApiKey, isNaN(numsOfLicenseAsNumber) ? 0 : numsOfLicenseAsNumber);
  };

  const handleDelete = (event: FormEvent) => {
    event.preventDefault();
    onDelete();
  };

  return (
    <>
      <div className="modal-body">
        <form onSubmit={handleSave}>
        <FormField
            id="talkUrl"
            label="Адрес пространства Толк"
            type="url"
            value={tempTalkUrl}
            onChange={(e) => setTempTalkUrl(e.target.value)}
            placeholder="Введите адрес пространства Толк"
          />
          <FormField
            id="apiKey"
            label="Ключ API"
            type="text"
            value={tempApiKey}
            onChange={(e) => setTempApiKey(e.target.value)}
            placeholder="Введите ключ API"
          />
          <FormField
            id="numsOfLicense"
            label="Количество лицензий Толк"
            type="text"
            value={tempNumsOfLicense}
            onChange={(e) => setTempNumsOfLicense(e.target.value)}
            placeholder="Введите количество приобретенных лицензий Толк"
          />
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