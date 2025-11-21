import React from 'react';
import ReactDOM from 'react-dom';

interface PopupWindowPortalProps {
    children: React.ReactNode;
    window: Window;
}

const PopupWindowPortal: React.FC<PopupWindowPortalProps> = ({ children, window }) => {
    const rootEl = window.document.getElementById('root');

    if (!rootEl) {
        return null;
    }

    return ReactDOM.createPortal(children, rootEl);
};

export default PopupWindowPortal;