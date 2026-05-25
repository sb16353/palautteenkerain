import LanguageSelector from "./LanguageSelector";
import Back from "./Back"
import { useId } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

export default function CommonControls() {
    const ccId = useId();
    const homeId = useId();
    
    const CORNER_OFFSET = "24px";

    const navigate = useNavigate();
    
    const { t } = useTranslation();

    return (<>
        <div 
            id={ccId}
            style={ 
                {
                    position: "absolute",
                    top: CORNER_OFFSET,
                    left: CORNER_OFFSET,
                    zIndex: 10
                }
            }
        >
            <Back/>
            <button id={homeId} onClick={() => navigate("/")}>
                ⌂ {t('home')}
            </button>
            <LanguageSelector/>
        </div>
    </>);
}