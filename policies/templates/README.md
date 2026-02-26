# 常见场景模板

本目录包含多个常见生活场景的国策模板，可以直接复制使用或作为参考。

## 模板列表

| 模板文件 | 场景描述 | 适用人群 |
|----------|----------|----------|
| [health-improvement.yaml](health-improvement.yaml) | 健康改善 | 想要改善身体状况的人 |
| [productivity-boost.yaml](productivity-boost.yaml) | 提升效率 | 想要提高工作效率的人 |
| [stress-management.yaml](stress-management.yaml) | 压力管理 | 压力大、焦虑的人 |
| [financial-freedom.yaml](financial-freedom.yaml) | 财务自由 | 想要改善财务状况的人 |
| [work-life-balance.yaml](work-life-balance.yaml) | 工作生活平衡 | 工作忙碌、缺乏生活的人 |
| [self-control-boost.yaml](self-control-boost.yaml) | 自控力提升 | ADHD/注意力障碍、拖延症患者 |

## 使用方法

### 方法一：直接使用

1. 选择适合你的模板文件
2. 复制到 `policies/` 目录
3. 重命名为 `my-policy.yaml`
4. 根据个人情况调整参数

### 方法二：在 Web 界面使用

1. 打开 Web 界面
2. 点击"导入模板"
3. 选择模板文件
4. 在编辑器中修改

## 模板定制指南

### 1. 调整初始状态

根据你的实际情况，修改 `initial_state`：

```yaml
initial_state:
  health: 5.0      # 你当前的健康评分（0-10）
  happiness: 5.0   # 你当前的幸福感评分
  # ...
```

### 2. 设定目标状态

根据你的期望，修改 `target_state`：

```yaml
target_state:
  health: 8.0      # 你希望达到的健康评分
  happiness: 7.5   # 你希望达到的幸福感评分
  # ...
```

### 3. 添加/删除国策

根据你的需求，添加或删除国策：

```yaml
policies:
  - name: "你的新国策"
    description: "描述"
    impact:
      health: 0.3
    cost: 1.0
```

### 4. 调整影响值

根据你的感受，调整国策对各维度的影响：

```yaml
impact:
  health: 0.5      # 增加影响值
  happiness: 0.2   # 减少影响值
```

## 组合使用

你可以组合多个模板，创建综合方案：

```yaml
# 导入健康改善模板的国策
policies:
  # 来自 health-improvement.yaml
  - name: "早起"
    # ...
  
  # 来自 productivity-boost.yaml
  - name: "番茄工作法"
    # ...
  
  # 来自 stress-management.yaml
  - name: "冥想"
    # ...
```

---


