import { ApiSettingsArgs, DeleteApiSettingsArgs } from "../types/apiTypes";
import MainApi from "./MainApi";

export const handleSaveApiSettings = async ({
    newTalkUrl,
    newApiKey,
    newNumsOfLicense,
    setTalkUrl,
    setApiKey,
    setNumsOfLicense,
    setMainApi,
    closePopups,
}: ApiSettingsArgs) => {
    try {
        localStorage.setItem("talkUrl", newTalkUrl);
        localStorage.setItem("apiKey", newApiKey);

        setTalkUrl(newTalkUrl);
        setApiKey(newApiKey);
        setNumsOfLicense(newNumsOfLicense);

        const updatedApiInstance = new MainApi({ url: newTalkUrl });
        updatedApiInstance.updateConfig({ apiKey: newApiKey });
        setMainApi(updatedApiInstance);
        closePopups();
    } catch (error) {
        console.error("Ошибка при сохранении настроек:", error);
    }
};

export const handleDeleteApiSettings = ({
    setTalkUrl,
    setApiKey,
    setNumsOfLicense,
    setMainApi,
    setMeetings,
    setActivePopup,
    setIsError,
    setIsInfoTooltipOpen,
  }: DeleteApiSettingsArgs) => {
    // Проверяем, есть ли значения в localStorage перед удалением
    const isSettingsEmpty = !localStorage.getItem("talkUrl") && !localStorage.getItem("apiKey");
  
    if (!isSettingsEmpty) {
      localStorage.removeItem("talkUrl");
      localStorage.removeItem("apiKey");
      
      setTalkUrl("");
      setApiKey("");
      setNumsOfLicense(0);
    
      // Создание нового экземпляра MainApi с начальными настройками
      const newApiInstance = new MainApi({ url: "" });
      setMainApi(newApiInstance);
  
      setMeetings([]);
    
      setActivePopup(null);
      setIsError(false);
      setIsInfoTooltipOpen(true);
    }
  };