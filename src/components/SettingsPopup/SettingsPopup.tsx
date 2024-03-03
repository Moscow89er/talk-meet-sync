import React from 'react';
import { SettingsPopupProps } from '../../utils/types/commonTypes';

const SettingsPopup: React.FC<SettingsPopupProps> = ({ onSave, talkUrl, setTalkUrl, apiKey, setApiKey }) => {
  return (
    <>
      <div className="modal-body">
        <form>
          <div className="mb-3">
            <label htmlFor="talkUrl" className="form-label">Адрес пространства Толк</label>
            <input
              type="url"
              className="form-control"
              id="talkUrl"
              value={talkUrl}
              onChange={(e) => setTalkUrl(e.target.value)}
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
          className={`btn btn-primary ${!talkUrl || !apiKey ? 'disabled' : ''}`}
          onClick={onSave}
          disabled={!talkUrl || !apiKey}
        >
          Сохранить
        </button>
      </div>
    </>
  );
};

export default SettingsPopup;
