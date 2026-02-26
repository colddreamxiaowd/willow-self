export function groupProjectsByTime(projects) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

  const groups = {
    today: [],
    yesterday: [],
    thisWeek: [],
    older: []
  };

  projects.forEach(project => {
    const updatedAt = new Date(project.updatedAt);
    
    if (updatedAt >= today) {
      groups.today.push(project);
    } else if (updatedAt >= yesterday) {
      groups.yesterday.push(project);
    } else if (updatedAt >= thisWeek) {
      groups.thisWeek.push(project);
    } else {
      groups.older.push(project);
    }
  });

  return groups;
}

export function formatTimeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return '刚刚';
  if (diffMins < 60) return `${diffMins}分钟前`;
  if (diffHours < 24) return `${diffHours}小时前`;
  if (diffDays < 7) return `${diffDays}天前`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`;
  return date.toLocaleDateString('zh-CN');
}

export function getProjectTypeLabel(type) {
  const labels = {
    'thought-experiment': '📝 思想实验',
    'policy-tree': '🌳 国策树',
    'node-editor': '🔧 节点编辑器',
    'yaml': '📄 YAML编辑'
  };
  return labels[type] || '📁 项目';
}

export function getProjectTypeColor(type) {
  const colors = {
    'thought-experiment': 'var(--sticky-yellow, #FFF7A1)',
    'policy-tree': 'var(--sticky-green, #C8F7C5)',
    'node-editor': 'var(--sticky-blue, #B5E8F7)',
    'yaml': 'var(--sticky-pink, #FFD1DC)'
  };
  return colors[type] || 'var(--sticky-yellow, #FFF7A1)';
}

// 最后更新时间: 2026-02-22 16:50
// 编辑人: Trae AI
