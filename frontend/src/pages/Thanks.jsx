import { useNavigate } from "react-router"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next";

export default function Thanks() {
    const navigate = useNavigate();

    const { t } = useTranslation();

    const [navTimer, setNavTimer] = useState(15);

    useEffect(() => {
        if (navTimer <= 0) {
            navigate(-1);
            return;
        }

        const timerId = setTimeout(() => {
            setNavTimer((prev) => prev - 1);
        }, 1000);

        return () => clearTimeout(timerId);
    }, [navTimer, navigate]);

    return (<>
        <div id="thanks">
            <h1>{t('thanks')}</h1>
            <div id="redirect-msg">
                <pre>{t('redirect-1')}</pre>
                <a href="#" onClick={e => {
                    e.preventDefault();
                    navigate(-1);
                }}>
                    <pre>{t('redirect-2')}</pre>
                </a>
                <pre> {navTimer}{t('redirect-3')}</pre>
            </div>       
        </div>
    </>)
}