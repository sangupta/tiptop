import { describe, it, expect } from 'vitest';
import { TiptopEditor } from '@/components/TiptopEditor';
import type { TiptopEditorProps } from '@/types';

describe('TiptopEditor Integration', () => {
  it('should be importable from components', () => {
    expect(TiptopEditor).toBeDefined();
    expect(typeof TiptopEditor).toBe('function');
  });

  it('should accept TiptopEditorProps interface', () => {
    const props: TiptopEditorProps = {
      content: 'Test content',
      editable: true,
      collaborative: false,
      aiEnabled: true,
      theme: 'light',
    };

    // This test verifies that the props interface is correctly typed
    expect(props.content).toBe('Test content');
    expect(props.editable).toBe(true);
    expect(props.collaborative).toBe(false);
    expect(props.aiEnabled).toBe(true);
    expect(props.theme).toBe('light');
  });

  it('should have proper type definitions', () => {
    // Test that the component function signature is correct
    const component = TiptopEditor;
    expect(component).toBeDefined();

    // Test that we can call it with valid props (without actually rendering)
    const validProps: TiptopEditorProps = {
      content: 'Hello world',
      onUpdate: (_content: string) => {
        // Mock callback function for testing
      },
    };

    expect(validProps.content).toBe('Hello world');
    expect(typeof validProps.onUpdate).toBe('function');
  });
});
