import { ApiSettingsArgs, DeleteApiSettingsArgs } from "../types/apiTypes";
import MainApi from "./MainApi";

export const handleSaveApiSettings = async ({
    newTalkUrl,
    newApiKey,
    newNumsOfLicence,
    setTalkUrl,
    setApiKey,
    setNumsOfLicence,
    setMainApi,
    closePopups,
}: ApiSettingsArgs) => {
    try {
        localStorage.setItem("talkUrl", newTalkUrl);
        localStorage.setItem("apiKey", newApiKey);

        setTalkUrl(newTalkUrl);
        setApiKey(newApiKey);
        setNumsOfLicence(newNumsOfLicence);

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
    setNumsOfLicence,
    setMainApi,
    setMeetings,
    setOverlappingMeetings,
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
      setNumsOfLicence(0);
    
      // Создание нового экземпляра MainApi с начальными настройками
      const newApiInstance = new MainApi({ url: "" });
      setMainApi(newApiInstance);
  
      setMeetings([]);
      setOverlappingMeetings([]);
    
      setActivePopup(null);
      setIsError(false);
      setIsInfoTooltipOpen(true);
    }
  };