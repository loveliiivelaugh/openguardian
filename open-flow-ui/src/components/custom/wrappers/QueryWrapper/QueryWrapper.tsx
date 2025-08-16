import { ReactNode, Suspense } from 'react';
import { useQuery, QueryClientProvider, QueryClient } from '@tanstack/react-query';

import { queries, paths } from '@api/index';
// import { apiScripts } from '../../../../utilities/scripts/api.scripts';
// import { graphqlQueries } from '@api/graphql/queries';


interface QueryWrapperProps {
    children: (data: any) => ReactNode
    path?: (paths: any) => string
    options?: {
        method: string
        payload?: any
        graphql: false | boolean
    }
    loadingContent?: ReactNode,
    errorContent?: (error: any) => ReactNode,
    [key: string]: any
};

const queryClient = new QueryClient();

const QueryWrapper2 = ({
    path,
    children,
    options,
    loadingContent,
    errorContent,
    ...props
}: QueryWrapperProps) => {
    // **
    //  * queryPath: path => (paths: string[]) => string
    //  * @param {object} - Array of available endpoints in backend services
    //  * @returns {string} - queryPath
    // */
    const functionQuery = props?.fn && ({
        queryKey: [props.fn],
        queryFn: props.fn({
            serverSchema: {} //todo uncomment //apiScripts.getSchema()
        })
    });

    const queryPath = path 
        ? path(
            options?.graphql
                ? {}//graphqlQueries
                : paths
        ) : "";

    const wrapperQuery = useQuery(
        props?.fn
            ? functionQuery
            : !options?.graphql
                ? queries.query(queryPath, options?.payload, options?.method)
                : queries.graphQuery(queryPath)
    );

    const handleSuccess = () => {
        if (props?.onData) props.onData(wrapperQuery.data);
        return children({ data: wrapperQuery.data });
    };
    
    return ({
        pending: (<>{children(wrapperQuery)}</>),
        loading: loadingContent 
            ? loadingContent 
            : <>{children(wrapperQuery)}</>,
        error: (
            errorContent 
                ? errorContent(wrapperQuery.error) 
                : <>{children(wrapperQuery)}</>
        ),
        success: (
            <Suspense fallback={<>{children(wrapperQuery)}</>}>
                {handleSuccess()}
            </Suspense>
        )
    }[wrapperQuery.status])
};

const QueryWrapper = ({ children, ...props }: QueryWrapperProps) => (
    <QueryClientProvider client={queryClient}>
        <QueryWrapper2 {...props}>
            {children}
        </QueryWrapper2>
    </QueryClientProvider>
);

export default QueryWrapper;