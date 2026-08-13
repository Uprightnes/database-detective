import React, { useEffect, useRef } from 'react';
import { EditorView, keymap, lineNumbers, highlightActiveLine } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { sql } from '@codemirror/lang-sql';
import { oneDark } from '@codemirror/theme-one-dark';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';

interface SQLEditorProps {
  value: string;
  onChange: (val: string) => void;
  onRun: () => void;
  disabled?: boolean;
}

const SQLEditor: React.FC<SQLEditorProps> = ({ value, onChange, onRun, disabled }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const runKeymap = keymap.of([
      {
        key: 'Ctrl-Enter',
        run: () => { onRun(); return true; },
      },
      {
        key: 'Mod-Enter',
        run: () => { onRun(); return true; },
      },
    ]);

    const state = EditorState.create({
      doc: value,
      extensions: [
        history(),
        lineNumbers(),
        highlightActiveLine(),
        sql(),
        oneDark,
        runKeymap,
        keymap.of([...defaultKeymap, ...historyKeymap]),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChange(update.state.doc.toString());
          }
        }),
        EditorView.theme({
          '&': {
            backgroundColor: '#161410',
            height: '100%',
            fontSize: '14px',
          },
          '.cm-content': {
            fontFamily: '"IBM Plex Mono", monospace',
            padding: '12px 4px',
            caretColor: '#c8a84b',
          },
          '.cm-line': { padding: '0 8px' },
          '.cm-activeLine': { backgroundColor: '#1e1c18' },
          '.cm-gutters': {
            backgroundColor: '#161410',
            borderRight: '1px solid #2a2520',
            color: '#4a4030',
          },
          '.cm-lineNumbers .cm-gutterElement': { padding: '0 8px 0 4px' },
        }),
        EditorView.editable.of(!disabled),
      ],
    });

    const view = new EditorView({ state, parent: containerRef.current });
    viewRef.current = view;

    return () => view.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync external value changes (e.g. clear button)
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const current = view.state.doc.toString();
    if (current !== value) {
      view.dispatch({
        changes: { from: 0, to: current.length, insert: value },
      });
    }
  }, [value]);

  return (
    <div
      ref={containerRef}
      style={{ height: '100%', overflow: 'hidden' }}
      className="rounded-b-md"
    />
  );
};

export default SQLEditor;
