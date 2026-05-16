import { useNavigate } from "react-router"
import { useTranslation } from "react-i18next"; 

export default function Back() {
    const navigate = useNavigate();
    const [t, i18n] = useTranslation(); 
    const canGoBack = window.history.length > 1;

    return <button disabled={!canGoBack} onClick={() => navigate(-1)}>←{t("back")}</button>
}