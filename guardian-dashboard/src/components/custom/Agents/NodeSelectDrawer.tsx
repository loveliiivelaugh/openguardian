// src/components/AgentFlow/NodeSelectorDrawer.tsx
import { Box, Typography, List, ListItemButton, ListItem, ListItemIcon, Tooltip } from "@mui/material"
import { useFlowStore } from "@store/v2/flowStore" // or wherever your flow state lives
import { v4 as uuid } from "uuid"
import { nodeLibrary } from "./NodeLibrary"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { queries } from "@api/index"
import startTutorialPopover from "./StartTutorial"

const NODE_TYPES = [
  { type: "agent", label: "Agent" },
  { type: "llm", label: "LLM" },
  { type: "action", label: "Action" },
  { type: "condition", label: "Condition" },
  { type: "trigger", label: "Trigger" },
  { type: "webhook", label: "Webhook" },
  { type: "memory", label: "Memory" },
  { type: "integration", label: "Integration" },
  { type: "wait", label: "Wait" }
]

const NodesLibraryStructure = {
  core: {
    controlFlow: {},
    systemUtilities: {},
    database: {},
    ai: {},
    triggers: {},
    hitl: {}
  },
  integration: {
    messaging: {},
    productivity: {},
    crm: {},
    finance: {},
    devops: {},
    http: {},
    webscraping: {}
  },
  agentflow: {
    agentActions: {},
    plannerTools: {},
    memoryOps: {},
    monitoring: {},
    internalApis: {}
  },

}

type NodeCategory = {
  name: string;
  slug: string;
  isSubcategory: boolean;
  category: string | null;
};

const formatCategories = (categories: NodeCategory[], nodeLibrary: any) => {
  let formatted: Record<string, { name: string }[]> = {}
  if (!categories || !nodeLibrary) return {}
  const topLevel = categories.filter(({ isSubcategory }) => !isSubcategory)
  topLevel.forEach(({ name, slug }) => {
    formatted[slug] = [
      { name: "Back to Categories" },
      ...categories.filter(({ category }) => category === slug),
      ...(nodeLibrary && nodeLibrary
        .filter(({ category }: { category: string }) => category === slug)
        .map((node: any) => ({ 
          name: node?.node_id
            ?.split("-")
            ?.map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
            ?.join(' '),
          ...node
        })))
    ]
  })
  return {
    ...formatted, 
    categories: topLevel
      .map(({ name, ...args }) => ({ 
        name: name
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' '),
        ...args
      }))
  }
}

export default function NodeSelectorDrawer() {
  const flowStore = useFlowStore()
  const nodeCategoriesQuery = useQuery(queries.query('/database/read_db/node_categories'))
  const nodeLibraryQuery = useQuery(queries.query('/database/read_db/node_library'))
  const categories = nodeCategoriesQuery.data?.data;
  const nodeLibrary = nodeLibraryQuery.data?.data;
  const formatted = formatCategories(categories, nodeLibrary);
  const [activeCategory, setActiveCategory] = useState<string | null>("categories")
  console.log(categories, "CATEGORIES", formatted, "ACTIVE: ", activeCategory, "KEY: ", formatted[activeCategory], "NODELIBRARY: ", nodeLibrary)
  
  const handleAdd = (node: any) => {
    const type = node?.category === "triggers" ? "trigger" : "function";
    console.log("handleAddL ", node, type)
    let newNode = {
      id: uuid(),
      type,
      position: {
        x: Math.random() * 600,
        y: Math.random() * 400,
      },
      data: {
        label: node?.name || node?.label || type.charAt(0).toUpperCase() + type.slice(1),
        type,
        run: type === 'trigger' ? 'noop' : node?.functionName || 'logToClients',
        args: node?.args_schema || {},
        args_schema: node?.args_schema || {},
        argsSchema: node?.args_schema || {},
        condition: node?.condition || '',
        forEach: node?.forEach || '',
        steps: node?.steps || [],
        next: node?.next || [],
        title: node?.title || '',
        description: node?.description || '',
        category: node?.category || '',
        config: {
          default_flow_id: '',
          assigned_flow_ids: [],
          cooldown_seconds: 30,
          behavior: 'default',
          context_mode: 'standard',
          created_by: 'guardian',
          ...node
        },
      },
    };
    const newNodeFR = nodeLibrary.find((node: any) => node.id === type)
    if (newNodeFR) {
      newNode.data = {
        ...newNode.data,
        ...newNodeFR
      }
    }

    flowStore.addNode(newNode);
  };

  const emojis = ['♻️', '👨🏻‍💻' , '✅', '⏰', '⬇️', '⬆️', '⬇️', '⬆️', '⬇️', '⬆️', '⬇️', '⬆️'];
  const camelCased = (string: string) => string.replace(" ", "-").toLowerCase();

  const handleCategoryListClick = (name: string) => (activeCategory === "categories") 
    ? setActiveCategory(camelCased(name))
    : (name === "Back to Categories")
      ? setActiveCategory("categories")
      : () => {}

  const CatergoryListItem = (props: any) => {
    const { name, index } = props;
    return (
      <Tooltip title={name} key={index}>
        <ListItem key={name} onClick={() => handleCategoryListClick(name)}>
          <ListItemIcon>
            {emojis[index]}
          </ListItemIcon>
          <ListItemButton onClick={() => ((activeCategory !== "categories") && (name !== "Back to Categories")) && handleAdd({ ...props, name })}>
            {name}
          </ListItemButton>
        </ListItem>
      </Tooltip>
    )
  }

  return (
    <Box p={2}>
      <Typography variant="h5" gutterBottom>
        ߷ Select Node Type
      </Typography>
      <List>
        {(formatted[activeCategory as keyof typeof formatted] || [] as any)
          .map(({ name, ...props }: { name: string }, index: number) => (name === "Triggers")
            ? startTutorialPopover(2, <CatergoryListItem name={name} index={index} {...props} />) 
            : (name === "Manual Trigger")
              ? startTutorialPopover(3, <CatergoryListItem name={name} index={index} {...props} />) 
              : <CatergoryListItem name={name} index={index} {...props} />
          )}
      </List>
    </Box>
  )
}
