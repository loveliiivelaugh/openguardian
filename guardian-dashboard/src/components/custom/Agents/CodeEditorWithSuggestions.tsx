// CodeEditorWithSuggestions.tsx
import { useEffect, useRef, useState } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { useFlowStore } from '@store/v2/flowStore';
import * as monaco from 'monaco-editor';

// import { useEffect, useRef, useState } from 'react';
// import MonacoEditor from '@monaco-editor/react';
// import { useFlowStore } from '@store/v2/flowStore';
// import * as monaco from 'monaco-editor';

export const CodeEditorWithSuggestions = ({
    nodeId,
    value,
    onChange,
    height = '300px',
    context = {}
}: {
    nodeId: string;
    value: string;
    onChange: (val: string) => void;
    height?: string;
    context?: Record<string, any>;
}) => {
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
    const { nodes, currentContext } = useFlowStore();

    const [code, setCode] = useState(value);
    const contextKeys = currentContext ? Object.keys(currentContext) : [];

    const availableVariables = [
        ...contextKeys,
        ...nodes.map((node) => `${node.id}.result`),
    ];

    const updateDecorations = () => {
        const editor = editorRef.current;
        if (!editor) return;

        console.log('editor', Object.keys(editor))
        const model = editor?.getModel();
        if (!model) return;

        const text = model.getValue();
        const matches = Array.from(text.matchAll(/{{(.*?)}}/g));

        const decorations = matches.map((match) => {
            const token = match[1].trim();
            const start = match.index || 0;
            const end = start + match[0].length;
            const exists = availableVariables.some((key) => token.startsWith(key));

            const startPos = model.getPositionAt(start);
            const endPos = model.getPositionAt(end);

            return {
                range: new monaco.Range(
                    startPos.lineNumber,
                    startPos.column,
                    endPos.lineNumber,
                    endPos.column
                ),
                options: {
                    inlineClassName: exists ? 'valid-variable' : 'invalid-variable',
                    hoverMessage: {
                        value: exists
                            ? `✅ Available in flow context`
                            : `❌ Not found in flow context`,
                    },
                },
            };
        });

        editor.deltaDecorations([], decorations);
    };

    const handleEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor, monaco: any) => {
        editorRef.current = editor;
        setTimeout(() => updateDecorations(), 50); // 👈 ensures it's fully mounted
    };

    useEffect(() => {
        monaco.languages.registerCompletionItemProvider('json', {
            provideCompletionItems: () => {
                const suggestions = availableVariables.map((label) => ({
                    label: `{{${label}}}`,
                    kind: monaco.languages.CompletionItemKind.Variable,
                    insertText: `{{${label}}}`,
                    detail: 'Flow context variable',
                }));
                return { suggestions };
            },
        });
    }, [availableVariables]);

    useEffect(() => {
        if (editorRef.current) updateDecorations();
    }, [code, contextKeys]);

    return (
        <div style={{ border: '1px solid #333', borderRadius: 6 }}>
            <MonacoEditor
                height={height}
                language="json"
                theme="vs-dark"
                value={value}
                onMount={handleEditorDidMount}
                onChange={(v) => {
                    setCode(v || '');
                    onChange(v || '');
                    updateDecorations();
                }}
                options={{
                    fontSize: 14,
                    minimap: { enabled: false },
                    formatOnType: true,
                    scrollBeyondLastLine: false,
                    wordWrap: 'on',
                    suggest: {
                        showWords: true,
                        showSnippets: true,
                    },
                }}
            />
            <style>{`
        .monaco-editor .valid-variable {
          text-decoration: underline wavy green;
        }
        .monaco-editor .invalid-variable {
          text-decoration: underline wavy red;
        }
      `}</style>
        </div>
    );
};

// const highlightInterpolations = (value: string, contextKeys: string[]) => {
//     return value.replace(/{{(.*?)}}/g, (match, p1) => {
//         const trimmed = p1.trim();
//         const exists = contextKeys.includes(trimmed);
//         return `<span style="text-decoration: underline; text-decoration-color: ${exists ? '#22c55e' : '#ef4444'}" title="${exists ? '✅ In context' : '❌ Not in context'}">{{${trimmed}}}</span>`;
//     });
// };

// export const CodeEditorWithSuggestions = ({
//     nodeId,
//     value,
//     onChange,
//     height = '300px',
//     context = {}
// }: {
//     nodeId: string;
//     value: string;
//     onChange: (val: string) => void;
//     height?: string;
//     context?: Record<string, any>;
// }) => {
//     const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
//     const { nodes, currentContext } = useFlowStore();

//     const [decorations, setDecorations] = useState<any[]>([]);
//     const [code, setCode] = useState(value);

//     useEffect(() => {
//         if (editorRef.current) {
//             const model = editorRef.current.getModel();
//             const matches = [...code.matchAll(/{{(.*?)}}/g)];
//             const keys = [];//getNodeContextSuggestions(context);
//             const newDecorations = matches.map((match: any) => {
//                 const full = match[0];
//                 const key = match[1].trim();
//                 const index = match.index || 0;
//                 const start = index + 3;
//                 const end = index + full.length - 2;
//                 return {
//                     range: {
//                         startLineNumber: model.getPositionAt(start).lineNumber,
//                         startColumn: model.getPositionAt(start).column,
//                         endLineNumber: model.getPositionAt(end).lineNumber,
//                         endColumn: model.getPositionAt(end).column
//                     },
//                     options: {
//                         inlineClassName: keys.includes(key) ? 'inline-success' : 'inline-error',
//                         hoverMessage: {
//                             value: keys.includes(key)
//                                 ? `✅ **${key}** is available in context`
//                                 : `❌ **${key}** not found in context`
//                         }
//                     }
//                 };
//             });
//             setDecorations(
//                 editorRef.current.deltaDecorations([], newDecorations)
//             );
//         }
//     }, [code, context]);

//     const availableVariables = nodes.map((node) => `{{${node.id}.result}}`);
//     const contextKeys = currentContext ? Object.keys(currentContext) : [];

//     const updateDecorations = () => {
//         const editor = editorRef.current;
//         if (!editor) return;

//         const model = editor.getModel();
//         if (!model) return;

//         const text = model.getValue();
//         const matches = Array.from(text.matchAll(/{{(.*?)}}/g));

//         const decorations = matches.map(match => {
//             const token = match[1];
//             const start = match.index || 0;
//             const end = start + match[0].length;
//             const exists = contextKeys.some((key) => token.startsWith(key));

//             const startPos = model.getPositionAt(start);
//             const endPos = model.getPositionAt(end);

//             return {
//                 range: new monaco.Range(
//                     startPos.lineNumber,
//                     startPos.column,
//                     endPos.lineNumber,
//                     endPos.column
//                 ),
//                 options: {
//                     inlineClassName: exists ? 'valid-variable' : 'invalid-variable',
//                     hoverMessage: { value: exists ? '✅ Available in context' : '❌ Not in context' },
//                 },
//             };
//         });

//         editor.deltaDecorations([], decorations);
//     };

//     useEffect(() => {
//         monaco.languages.registerCompletionItemProvider('json', {
//             provideCompletionItems: () => {
//                 const suggestions = availableVariables.map((label) => ({
//                     label,
//                     kind: monaco.languages.CompletionItemKind.Variable,
//                     insertText: label,
//                     detail: 'Node output reference',
//                 }));
//                 return { suggestions };
//             },
//         });
//     }, [availableVariables]);

//     const handleEditorDidMount = (_: any, editor: monaco.editor.IStandaloneCodeEditor) => {
//         editorRef.current = editor;
//         updateDecorations();
//     };

//     return (
//         <div style={{ border: '1px solid #333', borderRadius: 6 }}>
//             <MonacoEditor
//                 height={height}
//                 language="json"
//                 theme="vs-dark"
//                 value={value}
//                 onMount={handleEditorDidMount}
//                 onChange={(v) => {
//                     setCode(v || '');
//                     onChange && onChange(v);
//                     updateDecorations();
//                 }}
//                 options={{
//                     fontSize: 14,
//                     minimap: { enabled: false },
//                     formatOnType: true,
//                     scrollBeyondLastLine: false,
//                     wordWrap: 'on',
//                     suggest: {
//                         showWords: true,
//                         showSnippets: true
//                     }
//                 }}
//             />
//             <style>{`
//         .monaco-editor .valid-variable {
//           text-decoration: underline wavy green;
//         }
//         .monaco-editor .invalid-variable {
//           text-decoration: underline wavy red;
//         }
//       `}</style>
//         </div>
//     );
// };
