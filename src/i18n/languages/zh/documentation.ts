/**
 * Chinese translations for documentation page
 */

export const documentation = {
  title: '应用文档',
  description: 'Midora AI 前端应用程序的综合文档',
  navigation: {
    overview: '概述',
    theme: '主题变量',
    icons: '图标库',
    components: 'UI 组件',
    api: 'API 文档',
  },
  overview: {
    title: '文档概述',
    description: '欢迎来到 Midora AI 前端文档。此仪表板提供有关应用程序结构、主题系统、UI 组件等的综合信息。',
    sections: {
      theme: {
        title: '主题系统',
        description: '探索整个应用程序中使用的完整主题变量、颜色和样式系统。',
        features: [
          '浅色和深色模式支持',
          'CSS 自定义属性',
          'Tailwind CSS 集成',
          '响应式设计令牌'
        ]
      },
      icons: {
        title: '图标库',
        description: '浏览并交互使用应用程序中所有可用的图标。',
        features: [
          '交互式图标库',
          '每个图标的代码示例',
          '复制到剪贴板功能',
          '搜索和筛选功能'
        ]
      },
      components: {
        title: 'UI 组件',
        description: '可重用 UI 组件的综合库。',
        features: [
          '按钮变体',
          '表单输入',
          '卡片和布局',
          '加载状态'
        ]
      }
    }
  },
  theme: {
    title: '主题变量',
    description: '完整的主题系统，包括颜色、排版、间距等。',
    sections: {
      colors: {
        title: '调色板',
        description: '主要、次要和语义颜色定义'
      },
      typography: {
        title: '排版',
        description: '字体系列、大小、粗细和行高'
      },
      spacing: {
        title: '间距系统',
        description: '用于边距和内边距的一致间距值'
      },
      borders: {
        title: '边框系统',
        description: '边框半径、宽度和颜色定义'
      }
    },
    variables: {
      lightMode: '浅色模式变量',
      darkMode: '深色模式变量',
      surface: '表面颜色',
      text: '文本颜色',
      border: '边框颜色',
      primitive: '原始颜色'
    }
  },
  icons: {
    title: '图标库',
    description: '所有可用图标的交互式库，包含代码示例。',
    search: {
      placeholder: '搜索图标...',
      noResults: '未找到匹配您搜索的图标。',
      totalCount: '图标总数：{count}'
    },
    code: {
      title: '使用代码',
      copy: '复制代码',
      copied: '已复制！',
      import: '导入',
      usage: '使用示例'
    },
    categories: {
      all: '所有图标',
      navigation: '导航',
      actions: '操作',
      media: '媒体',
      communication: '通信',
      files: '文件和文件夹'
    }
  },
  components: {
    title: 'UI 组件',
    description: '带有示例和文档的可重用 UI 组件。',
    categories: {
      buttons: '按钮',
      inputs: '表单输入',
      cards: '卡片和布局',
      navigation: '导航',
      feedback: '反馈和加载'
    }
  },
  common: {
    loading: '加载中...',
    error: '加载内容时出错',
    retry: '重试',
    copy: '复制',
    copied: '已复制！',
    search: '搜索',
    filter: '筛选',
    clear: '清除',
    back: '返回',
    next: '下一步',
    previous: '上一步',
    close: '关闭',
    open: '打开',
    expand: '展开',
    collapse: '折叠'
  }
}

