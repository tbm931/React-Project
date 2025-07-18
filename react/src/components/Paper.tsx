import { type PaperProps, Paper } from "@mui/material";
import React from "react";
import Draggable from "react-draggable";

const PaperComponent = (props: PaperProps) => {
    const nodeRef = React.useRef<HTMLDivElement>(null);
    return (
        <Draggable
            nodeRef={nodeRef as React.RefObject<HTMLDivElement>}
            handle="#draggable-dialog-title"
            cancel={'[class*="MuiDialogContent-root"]'}
        >
            <Paper {...props} ref={nodeRef} />
        </Draggable>
    );
}

export default PaperComponent;