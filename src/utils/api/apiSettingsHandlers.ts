import { ApiSettingsArgs, DeleteApiSettingsArgs } from "../types/apiTypes";
import MainApi from "./MainApi";

export const handleSaveApiSettings = async ({
    newTalkUrl,
    newApiKey,
    newNumsOfLicence,
    setApiSettings,
    closePopups,
}: ApiSettingsArgs) => {
    try {
        localStorage.setItem("talkUrl", newTalkUrl);
        localStorage.setItem("apiKey", newApiKey);

        const updatedApiInstance = new MainApi({ url: newTalkUrl });
        updatedApiInstance.updateConfig({ apiKey: newApiKey });

        setApiSettings(prevSettings => ({
          ...prevSettings,
          talkUrl: newTalkUrl,
          apiKey: newApiKey,
          numsOfLicence: newNumsOfLicence,
          mainApi: updatedApiInstance,
        }));

        closePopups();
    } catch (error) {
        console.error("Ошибка при сохранении настроек:", error);
    }
};

export const handleDeleteApiSettings = ({
    setApiSettings,
    setMeetings,
    setOverlappingMeetings,
    closePopup,
    setIsError,
    setIsInfoTooltipOpen,
  }: DeleteApiSettingsArgs) => {
    // Проверяем, есть ли значения в localStorage перед удалением
    const isSettingsEmpty = !localStorage.getItem("talkUrl") && !localStorage.getItem("apiKey");
  
    if (!isSettingsEmpty) {
      localStorage.removeItem("talkUrl");
      localStorage.removeItem("apiKey");
      
      setApiSettings({ // Сброс к начальным настройкам
        talkUrl: "",
        apiKey: "",
        numsOfLicence: 1,
        mainApi: new MainApi({ url: "" }),
      });
  
      setMeetings([]);
      setOverlappingMeetings([]);
    
      closePopup();

      setIsError(false);
      setIsInfoTooltipOpen(true);
    }
};