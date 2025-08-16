import { render } from '@testing-library/react';
import Providers from '@custom/providers/Providers';


const customRender = (ui: any, options?: any) => render(
    ui, 
    { wrapper: Providers, ...options ? options : {} }
);

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };