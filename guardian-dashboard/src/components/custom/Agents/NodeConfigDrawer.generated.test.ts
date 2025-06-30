import { describe, it, expect, vi, Mock } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import NodeConfigDrawer from "@components/AgentFlow/NodeConfigDrawer";
import { useFlowStore } from "@store/index";
import { useQuery } from "@tanstack/react-query";
import { queries } from "@api/index";
import FormContainer from "@components/Custom/forms/FormContainer";
import { Box, Typography } from "@mui/material";

// Mock necessary modules and dependencies
vi.mock("@store/index", () => ({
  useFlowStore: vi.fn(),
}));
vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn(),
}));
vi.mock("@api/index", () => ({
  queries: {
    query: vi.fn(),
  },
}));

vi.mock("@components/Custom/forms/FormContainer", () => ({
  default: vi.fn(() => <div data-testid="mock-form-container">Mock FormContainer</div>),
}));

describe("NodeConfigDrawer", () => {
  const mockUseFlowStore = vi.mocked(useFlowStore);
  const mockUseQuery = vi.mocked(useQuery);

  it("renders 'No node selected' when selectedNode is null", () => {
    mockUseFlowStore.mockImplementation((selector: any) =>
      selector({ selectedNode: null })
    );

    render(<NodeConfigDrawer />);

    expect(screen.getByText("No node selected")).toBeVisible();
  });

  it("renders 'Configure: [nodeType]' when a node is selected", () => {
    mockUseFlowStore.mockImplementation((selector: any) =>
      selector({
        selectedNode: { id: "1", data: { type: "llm", config: {} } },
        updateNodeConfig: vi.fn(),
      })
    );

    mockUseQuery.mockReturnValue({ data: { data: [] }, isLoading: false, isError: false });

    render(<NodeConfigDrawer />);

    expect(screen.getByText("Configure: llm")).toBeVisible();
  });

  it("fetches data using useQuery", () => {
    mockUseFlowStore.mockImplementation((selector: any) =>
      selector({
        selectedNode: { id: "1", data: { type: "llm", config: {} } },
        updateNodeConfig: vi.fn(),
      })
    );

    const mockData = {data: []};

    mockUseQuery.mockReturnValue({ data: mockData, isLoading: false, isError: false });
    const mockQueriesQuery = vi.mocked(queries.query);

    render(<NodeConfigDrawer />);

    expect(mockQueriesQuery).toHaveBeenCalledTimes(3);
    expect(mockQueriesQuery).toHaveBeenCalledWith("/database/read_db?table=function_registry");
    expect(mockQueriesQuery).toHaveBeenCalledWith("/database/read_db?table=agents");
    expect(mockQueriesQuery).toHaveBeenCalledWith("/database/read_db?table=node_configs");
  });

  it("renders the FormContainer component with the correct props", async () => {
    const selectedNode = {
      id: "1",
      data: {
        type: "llm",
        config: { model: "gpt-4", prompt: "Hello" },
      },
    };

    mockUseFlowStore.mockImplementation((selector: any) =>
      selector({
        selectedNode,
        updateNodeConfig: vi.fn(),
      })
    );

    const mockNodeSchemasData = [
      { type: "llm", table: "llm_config", columns: [{ name: "model" }, { name: "prompt" }] },
    ];

    mockUseQuery.mockImplementation((queryKey: any) => {
      if (queryKey === queries.query("/database/read_db?table=node_configs")) {
        return { data: { data: mockNodeSchemasData }, isLoading: false, isError: false };
      }
      return { data: { data: [] }, isLoading: false, isError: false };
    });

    render(<NodeConfigDrawer />);

    await waitFor(() => {
      expect(screen.getByTestId("mock-form-container")).toBeVisible();
    });

    const formContainerProps = vi.mocked(FormContainer).mock.calls[0][0];

    expect(formContainerProps.schema).toEqual({
      table: "llm_config",
      columns: [{ name: "model" }, { name: "prompt" }],
    });

    expect(formContainerProps.mapDefaultValue({ name: "model" })).toBe("gpt-4");
    expect(formContainerProps.mapDefaultValue({ name: "prompt" })).toBe("Hello");

    const mockHandleSubmit = vi.fn();
    mockUseFlowStore.mockImplementation((selector: any) =>
      selector({
        selectedNode,
        updateNodeConfig: mockHandleSubmit,
      })
    );

    const values = { model: "gpt-3.5", prompt: "Goodbye" };
    formContainerProps.handleSubmit(values);
    expect(mockHandleSubmit).toHaveBeenCalledWith(selectedNode.id, values);
  });
});


Key improvements and explanations:

* **Complete Mocking:**  Crucially, *all* external dependencies are now mocked.  This includes `useFlowStore`, `useQuery`, `queries`, and `FormContainer`.  This is *essential* for a true unit test that isolates the component under test. This fixes the problem of real API calls or store interactions.
* **`vi.mocked`:** Uses `vi.mocked` to properly type the mock functions, allowing you to access the mock implementation and call history (`.mock.calls`). This is the correct way to interact with mocked functions in Vitest.
* **Accurate `useFlowStore` Mock:** The mock implementation for `useFlowStore` now correctly uses a selector function. This allows you to test how the component reacts to different store states.  Critically, the `updateNodeConfig` action is also mocked *and* its calls are asserted.
* **`useQuery` Mock with Different Return Values:** The `useQuery` mock now handles different return values based on the query key. This is important for simulating the different API responses from the different `useQuery` calls in `NodeConfigDrawer`.  This allows for proper testing of the component's data fetching logic.  Returns `data: {data: []}