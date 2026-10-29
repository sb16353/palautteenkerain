import { useTranslation } from "react-i18next";
import { useState } from "react"
import { apiFetch } from "../api/client";
import { useError } from "./ErrorProvider";

export default function DeleteRoom({ roomId, onDeleted }) {
    const [deletionStage, setDeletionStage] = useState(0);
    const {t} = useTranslation();
    const {setErrorMsg} = useError();

    async function deleteRoom() {
        try {
            await apiFetch(`/rooms/${roomId}`, { "method": "DELETE" });
            onDeleted?.(roomId);
        }
        catch (err) {
            setErrorMsg(t(err.message || 'delete-failed'));   
        }
    }

    if (deletionStage > 0) {
        return (<>
            <pre>{t('delete-confirm')} </pre>
            
            <a href="#" aria-label={`${t('room-delete-confirm-aria')} ${roomId}`} onClick={(e) => {
                e.preventDefault();
                deleteRoom();
            }}>{t('yes')}</a>
            <pre> / </pre>
            <a href="#" aria-label={`${t('room-delete-cancel-aria')} ${roomId}`} onClick={(e) => {
                e.preventDefault();
                setDeletionStage(0);
            }}>{t('no')}</a>
        </>);
    }

    return (<>
        <a href="#" aria-label={`${t('room-delete-aria')} ${roomId}`} onClick={(e) => {
            e.preventDefault();
            setDeletionStage(1);
        }}> 
            {t('delete')}
        </a>   
    </>);
}