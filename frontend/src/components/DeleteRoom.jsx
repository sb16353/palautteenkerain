import { useTranslation } from "react-i18next";
import { useState } from "react"
import { apiFetch } from "../api/client";
import { useSearchParams } from "react-router";
import { useError } from "./ErrorProvider";

export default function DeleteRoom({ roomId }) {
    const [deletionStage, setDeletionStage] = useState(0);
    const {t, i18n} = useTranslation();
    const {setErrorMsg} = useError();

    async function deleteRoom() {
        try {
            await apiFetch(`/rooms/${roomId}`, { "method": "DELETE" });
        }
        catch (err) {
            setErrorMsg(t(err.message || 'delete-failed'))    
            console.log(err);
        }
        finally {
            window.location.reload();
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