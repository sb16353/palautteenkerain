import { useNavigate } from "react-router"
import { useState } from "react"
import { useTranslation } from "react-i18next";

export default function Thanks() {
    const navigate = useNavigate();

    const {t, i18n} = useTranslation();

    const [navTimer, setNavTimer] = useState(10);

    const decrTimerInterval = setInterval(updateTimer, 1000);

    function updateTimer() {
        setNavTimer(navTimer - 1);
        if (navTimer < 1) { 
            navigate("/");
            clearInterval(decrTimerInterval);
        }
    }

    return (<>
        <div id="thanks">
            <h1>{t('thanks')}</h1>
            <div id="redirect-msg">
                <pre>{t('redirect-1')}</pre>
                <a href="#" onClick={e => {
                    e.preventDefault();
                    navigate("/");
                }}><pre>{t('redirect-2')}</pre></a>
                <pre> {navTimer}{t('redirect-3')}</pre>
            </div>       
        </div>
    </>)
}