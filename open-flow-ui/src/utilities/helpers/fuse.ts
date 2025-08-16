import { useEffect, useState } from 'react';
import Fuse from 'fuse.js';

type FuseHookPropsType = {
    list?: any[];
    fuseOptions?: {
        keys?: string[];
        isCaseSensitive?: boolean;
        includeScore?: boolean;
        ignoreDiacritics?: boolean;
        shouldSort?: boolean;
        includeMatches?: boolean;
    };
};

export const useFuse = (props?: FuseHookPropsType) => {
    const [list, setList] = useState(props?.list ? props.list : []);
    const [initializedFuse, setInitializedFuze] = useState<any>(null);
    const [options, setOptions] = useState({});

    const fuseOptions = {
        // isCaseSensitive: false,
        // includeScore: false,
        // ignoreDiacritics: false,
        // shouldSort: true,
        // includeMatches: false,
        // findAllMatches: false,
        // minMatchCharLength: 1,
        // location: 0,
        // threshold: 0.6,
        // distance: 100,
        // useExtendedSearch: false,
        // ignoreLocation: false,
        // ignoreFieldNorm: false,
        // fieldNormWeight: 1,
        keys: [
            "title",
            "author.firstName"
        ],
        ...props?.fuseOptions && props.fuseOptions,
        ...options
    };

    useEffect(() => {
        const fuse = new Fuse(list, fuseOptions);
        setInitializedFuze(fuse);
    }, [list]);

    const searchList = (
        searchPattern: string, 
        thisList: FuseHookPropsType["list"], 
        options?: any
    ) => {
        const tempFuse = new Fuse(thisList || [], { ...fuseOptions, ...options });
        return tempFuse.search(searchPattern);
    };

    return { 
        fuse: initializedFuse,
        list,
        setList: (newList: FuseHookPropsType["list"], options?: FuseHookPropsType["fuseOptions"]) => {
            if (options) setOptions(options);
            if (newList) setList(newList);
        },
        searchList
    };
};