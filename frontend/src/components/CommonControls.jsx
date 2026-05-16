import LanguageSelector from "./LanguageSelector";
import Back from "./Back"
import { useId } from "react";

export default function CommonControls() {
    const ccId = useId();
    const CORNER_OFFSET = "24px";
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
            <LanguageSelector/>
        </div>
    </>);
}