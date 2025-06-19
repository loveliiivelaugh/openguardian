import { Box } from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { Folder } from '@mui/icons-material';
import { FaReact } from "react-icons/fa";
import type { ReactNode } from 'react';
import { MenuItemType } from './TreeView.type';


// Recursive function to render TreeItems and nested menus
const renderTree = (menuItems: MenuItemType[], onClick?: (menuItem: MenuItemType) => void) => menuItems
    .map((item, index) => (
        <TreeItem 
            key={index}
            slots={{ 
                icon: (
                    item.label.includes(".js") 
                    || item.label.includes(".ts")
                )
                    //todo convert this to a whole file icon formatter
                    ? FaReact 
                    : Folder 
            }}
            label={item.label} 
            itemId={item.id}
            onClick={
                item?.onClick
                    ? item.onClick 
                    : () => onClick 
                        ? onClick(item) 
                        : {}
            }
        >
            {(Array.isArray(item.menu) && (item.menu.length > 0)) 
                && renderTree(item.menu)
            }
        </TreeItem>
    ));

const BasicSimpleTreeView = (props: { menu: MenuItemType[], onClick?: (menuItem: MenuItemType) => void }) => (
    <Box sx={{ minHeight: 352, minWidth: 250 }}>
        <SimpleTreeView>
            {renderTree(props.menu, props?.onClick)}
        </SimpleTreeView>
    </Box>
);

export default BasicSimpleTreeView;
