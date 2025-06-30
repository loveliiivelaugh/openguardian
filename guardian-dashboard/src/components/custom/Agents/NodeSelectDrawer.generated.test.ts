import { render, screen, fireEvent } from '@testing-library/react';
import NodeSelectorDrawer from '../src/components/AgentFlow/NodeSelectorDrawer';
import { useFlowStore } from '../src/store/index'; // Adjust path if needed
import { useStore } from 'zustand';
import { vi, afterEach } from 'vitest';

// Mock zustand store
vi.mock('zustand');

// Mock useFlowStore
vi.mock('../src/store/index', () => ({
  useFlowStore: vi.fn(),
}));


describe('NodeSelectorDrawer', () => {
  const mockAddNode = vi.fn();

  beforeEach(() => {
    (useFlowStore as any).mockReturnValue({
      addNode: mockAddNode,
    });

    (useStore as any).mockImplementation((selector: any) => selector(useFlowStore()));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });


  it('renders the component', () => {
    render(<NodeSelectorDrawer />);
    expect(screen.getByText('Select Node Type')).toBeInTheDocument();
  });

  it('renders a list of node types', () => {
    render(<NodeSelectorDrawer />);
    expect(screen.getByText('Agent')).toBeInTheDocument();
    expect(screen.getByText('LLM')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
    expect(screen.getByText('Condition')).toBeInTheDocument();
    expect(screen.getByText('Trigger')).toBeInTheDocument();
    expect(screen.getByText('Webhook')).toBeInTheDocument();
    expect(screen.getByText('Memory')).toBeInTheDocument();
    expect(screen.getByText('Integration')).toBeInTheDocument();
    expect(screen.getByText('Wait')).toBeInTheDocument();
  });

  it('calls addNode with the correct parameters when a node type is clicked', () => {
    render(<NodeSelectorDrawer />);
    const agentButton = screen.getByText('Agent');
    fireEvent.click(agentButton);

    expect(mockAddNode).toHaveBeenCalledTimes(1);
    const nodeArgument = mockAddNode.mock.calls[0][0];

    expect(nodeArgument).toEqual(
      expect.objectContaining({
        type: "default",
        data: expect.objectContaining({
          label: "Agent",
          type: "agent",
          config: {}
        })
      })
    );

     expect(typeof nodeArgument.id).toBe('string');
     expect(typeof nodeArgument.position.x).toBe('number');
     expect(typeof nodeArgument.position.y).toBe('number');
  });

});


Key improvements and explanations:

* **Mocking Zustand and `useFlowStore`**:  Crucially, this code *correctly* mocks `useFlowStore` and `useStore`.  It uses `vi.mock` to replace the actual imports with mock implementations.  This prevents your test from relying on a real store and makes it predictable. The `useFlowStore` mock returns an object with an `addNode` function.  The `useStore` mock implements just enough of zustand's functionality to allow the component to render. The most important point is that the  `useStore` mocks should return the store's state or a part of it that the component is using.
* **`vi.clearAllMocks()`**:  Using `vi.clearAllMocks()` in `afterEach` is important to reset mock call counts between tests, preventing interference.
* **`toHaveBeenCalledTimes(1)`**: This ensures the `addNode` function is only called one time when clicking.
* **Assertions on `addNode` arguments**: This test verifies that `addNode` is called with the *correct* arguments. It checks the `type`, `label`, and `config` of the node data.  It also uses `expect.objectContaining` for more flexible checking, which means you don't have to check *every* property of the node object.  Finally, we check that the `id` is a string, and `position.x` and `position.y` are numbers, so we know the uuid and random numbers are working.
* **`beforeEach`**: Sets up the mocks before *each* test, ensuring a clean slate.
* **Clearer `render`**: The test renders the component under test.
* **Correct import paths**: I've fixed the import paths, assuming your file structure.  Adjust them if your actual file paths are different.
* **No unnecessary `act`**: `act` is not needed here.  MUI's components handle their state updates correctly, so a regular `fireEvent.click` is sufficient.

How to run this test:

1.  **Install dependencies:** `npm install -D vitest @testing-library/react @testing-library/user-event @mui/material @mui/icons-material jsdom @types/uuid identity-obj-proxy`
2.  **Configure Vitest:** Add a `vitest.config.ts` file to your project root (or modify your existing one) with these contents:

    
    import { defineConfig } from 'vitest/config'
    import react from '@vitejs/plugin-react'

    export default defineConfig({
      plugins: [react()],
      test: {
        environment: 'jsdom',
        mockReset: true, // Resets mocks before each test
        globals: true, // enables `expect` globally
      },
      resolve: {
        alias: {
          '@mui/material': '@mui/material',  // Needed to fix material-ui import error
          '@mui/icons-material': '@mui/icons-material',
          '@store':  './src/store',  // Adjust the path to your store directory
        },
      },
    }