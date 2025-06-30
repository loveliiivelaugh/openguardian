import { supabase } from '@api/supabase';
import { nodeLibrary } from './your-local-nodeLibrary-file';

async function seedNodeLibrary() {
  for (const node of nodeLibrary) {
    const { error } = await supabase
      .from('node_library')
      .insert({
        node_id: node.id,
        label: node.label,
        description: node.description,
        category: node.category,
        args_schema: node.argsSchema,
      });

    if (error) {
      console.error('Error inserting node:', node.id, error);
    } else {
      console.log('✅ Inserted node:', node.id);
    }
  }
}

seedNodeLibrary();
