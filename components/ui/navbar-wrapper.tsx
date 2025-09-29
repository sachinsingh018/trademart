"use client";

import Navbar from "./navbar";
import { usePopup } from "@/contexts/PopupContext";

export default function NavbarWrapper() {
    const { isPopupActive } = usePopup();

    return <Navbar isPopupActive={isPopupActive} />;
}
