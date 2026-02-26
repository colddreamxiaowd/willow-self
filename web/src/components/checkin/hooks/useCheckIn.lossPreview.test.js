import { countDescendants } from './useCheckIn';

describe('countDescendants helper', () => {
  const nodes = [
    { id: 'root', data: { parentId: null } },
    { id: 'child1', data: { parentId: 'root' } },
    { id: 'child2', data: { parentId: 'root' } },
    { id: 'grandchild1', data: { parentId: 'child1' } },
    { id: 'grandchild2', data: { parentId: 'child1' } },
    { id: 'grandchild3', data: { parentId: 'child2' } },
  ];

  test('counts all descendants for root', () => {
    expect(countDescendants(nodes, 'root')).toBe(5);
  });

  test('counts descendants for middle node', () => {
    expect(countDescendants(nodes, 'child1')).toBe(2);
  });

  test('returns 0 for leaf node', () => {
    expect(countDescendants(nodes, 'grandchild1')).toBe(0);
  });

  test('returns 0 for non-existent node', () => {
    expect(countDescendants(nodes, 'nonexistent')).toBe(0);
  });
});
