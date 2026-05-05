import { useId } from "react"
import { useTranslation } from "react-i18next";

export default function LanguageSelector() {
    const { i18n } = useTranslation();

    const currentLng = i18n.language;
    const supportedLngs = i18n.options.supportedLngs.filter(lng => lng !== 'cimode');

    const displayNames = new Intl.DisplayNames([currentLng], {
        type: 'language',
    });

    const selectorId = useId();

    const languages = supportedLngs
    .map((lng) => ({
    code: lng,
    name: displayNames.of(lng),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

    const CORNER_OFFSET = "24px";

    return (
        <select
            id={selectorId}
            value={currentLng}
            onChange={(e) => i18n.changeLanguage(e.target.value)}
            style={ 
                {
                    position: "absolute",
                    top: CORNER_OFFSET,
                    left: CORNER_OFFSET
                }
            }
        >
            {languages.map((lng) => (
                <option key={lng.code} value={lng.code}>
                    {lng.name}
                </option>
            ))}
        </select>
    );
}