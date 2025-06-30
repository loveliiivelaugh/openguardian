type RawConfig = {
    type: string
    label: string
    table_name: string
    columns: any[]
  }
  
  type DynamicValues = {
    availableFunctions?: string[]
    availableAgents?: string[]
  }
  
  export function formatNodeConfigs(configs: RawConfig[], dynamic: DynamicValues) {
    return Object.fromEntries(
      configs.map((conf) => {
        const updatedColumns = conf.columns.map((col) => {
          if (col.name === 'agent' && dynamic.availableAgents) {
            return { ...col, enumValues: dynamic.availableAgents }
          }
          if (col.name === 'functions' || col.name === 'function') {
            return { ...col, enumValues: dynamic.availableFunctions }
          }
          return col
        })
  
        return [conf.type, { ...conf, columns: updatedColumns }]
      })
    )
  }
  