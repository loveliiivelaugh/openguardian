import type { ReactNode } from 'react';

type MenuItemType = {
    id: string;
    label: string;
    menu?: MenuItemType[];
    icon?: ReactNode;
    onClick?: () => void;
};

export type { MenuItemType }