import { describe, it, expect } from 'vitest';
import { formatNodeConfigs } from '../src/your-file'; // Replace with the actual path to your file

describe('formatNodeConfigs', () => {
  it('should return an empty object when given an empty array', () => {
    const configs: any[] = [];
    const dynamic = {};
    const result = formatNodeConfigs(configs, dynamic);
    expect(result).toEqual({});
  });

  it('should return a formatted object with the original config when no dynamic values are provided', () => {
    const configs = [
      { type: 'testType', label: 'Test Label', table_name: 'test_table', columns: [{ name: 'testColumn' }] },
    ];
    const dynamic = {};
    const result = formatNodeConfigs(configs, dynamic);
    expect(result).toEqual({
      testType: { type: 'testType', label: 'Test Label', table_name: 'test_table', columns: [{ name: 'testColumn' }] },
    });
  });

  it('should update the `enumValues` for agent columns when `availableAgents` are provided in dynamic values', () => {
    const configs = [
      { type: 'testType', label: 'Test Label', table_name: 'test_table', columns: [{ name: 'agent' }] },
    ];
    const dynamic = { availableAgents: ['agent1', 'agent2'] };
    const result = formatNodeConfigs(configs, dynamic);
    expect(result).toEqual({
      testType: {
        type: 'testType',
        label: 'Test Label',
        table_name: 'test_table',
        columns: [{ name: 'agent', enumValues: ['agent1', 'agent2'] }],
      },
    });
  });

  it('should update the `enumValues` for function columns when `availableFunctions` are provided in dynamic values', () => {
    const configs = [
      { type: 'testType', label: 'Test Label', table_name: 'test_table', columns: [{ name: 'functions' }] },
    ];
    const dynamic = { availableFunctions: ['func1', 'func2'] };
    const result = formatNodeConfigs(configs, dynamic);
    expect(result).toEqual({
      testType: {
        type: 'testType',
        label: 'Test Label',
        table_name: 'test_table',
        columns: [{ name: 'functions', enumValues: ['func1', 'func2'] }],
      },
    });
  });

  it('should update the `enumValues` for function columns when `availableFunctions` are provided and column name is "function"', () => {
    const configs = [
      { type: 'testType', label: 'Test Label', table_name: 'test_table', columns: [{ name: 'function' }] },
    ];
    const dynamic = { availableFunctions: ['func1', 'func2'] };
    const result = formatNodeConfigs(configs, dynamic);
    expect(result).toEqual({
      testType: {
        type: 'testType',
        label: 'Test Label',
        table_name: 'test_table',
        columns: [{ name: 'function', enumValues: ['func1', 'func2'] }],
      },
    });
  });


  it('should handle multiple configs and multiple column updates', () => {
    const configs = [
      { type: 'type1', label: 'Label 1', table_name: 'table1', columns: [{ name: 'agent' }, { name: 'col1' }] },
      { type: 'type2', label: 'Label 2', table_name: 'table2', columns: [{ name: 'functions' }, { name: 'col2' }] },
    ];
    const dynamic = { availableAgents: ['agentA', 'agentB'], availableFunctions: ['funcA', 'funcB'] };
    const result = formatNodeConfigs(configs, dynamic);
    expect(result).toEqual({
      type1: {
        type: 'type1',
        label: 'Label 1',
        table_name: 'table1',
        columns: [{ name: 'agent', enumValues: ['agentA', 'agentB'] }, { name: 'col1' }],
      },
      type2: {
        type: 'type2',
        label: 'Label 2',
        table_name: 'table2',
        columns: [{ name: 'functions', enumValues: ['funcA', 'funcB'] }, { name: 'col2' }],
      },
    });
  });

  it('should not modify columns that do not match "agent", "functions", or "function"', () => {
      const configs = [
          { type: 'testType', label: 'Test Label', table_name: 'test_table', columns: [{ name: 'otherColumn', type: 'string' }] },
      ];
      const dynamic = { availableAgents: ['agent1', 'agent2'], availableFunctions: ['func1', 'func2'] };
      const result = formatNodeConfigs(configs, dynamic);
      expect(result).toEqual({
          testType: {
              type: 'testType',
              label: 'Test Label',
              table_name: 'test_table',
              columns: [{ name: 'otherColumn', type: 'string' }],
          },
      });
  });
}