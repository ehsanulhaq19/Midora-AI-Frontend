'use client'

import { useState } from 'react'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { 
  Grid,
  ArrowDownSm,
  ArrowRightSm,
  ArrowUpSm,
  AudioSettings,
  CaretDown,
  CheckBroken,
  CheckBroken4,
  ChevronDown,
  Close,
  Collapse,
  CollapseButton,
  DownArrowSm,
  FolderOpen,
  FolderOpen01,
  FolderOpen02,
  FolderPlus,
  Folders,
  FoldersIcon,
  FormatOutlineWeightBold,
  Icon6122191,
  Image26,
  Menu,
  Microphone,
  Midoras,
  MidorasIcon,
  MinusSquare,
  MoreOptions,
  Plus01_5,
  Paperclip,
  Lightbulb,
  Lightning,
  Search,
  Search02,
  Star,
  Stars,
  Scale,
  Code,
  Copy,
  LogoOnly,
  Logout,
  Filters,
  PersonFace,
  AI
} from '@/icons'

export default function AppDocumentsPage() {
  const [showIcons, setShowIcons] = useState(false)

  const icons = [
    { name: 'ArrowDownSm', component: ArrowDownSm },
    { name: 'ArrowRightSm', component: ArrowRightSm },
    { name: 'ArrowUpSm', component: ArrowUpSm },
    { name: 'AudioSettings', component: AudioSettings },
    { name: 'CaretDown', component: CaretDown },
    { name: 'CheckBroken', component: CheckBroken },
    { name: 'CheckBroken4', component: CheckBroken4 },
    { name: 'ChevronDown', component: ChevronDown },
    { name: 'Close', component: Close },
    { name: 'Collapse', component: Collapse },
    { name: 'CollapseButton', component: CollapseButton },
    { name: 'DownArrowSm', component: DownArrowSm },
    { name: 'FolderOpen', component: FolderOpen },
    { name: 'FolderOpen01', component: FolderOpen01 },
    { name: 'FolderOpen02', component: FolderOpen02 },
    { name: 'FolderPlus', component: FolderPlus },
    { name: 'Folders', component: Folders },
    { name: 'FoldersIcon', component: FoldersIcon },
    { name: 'FormatOutlineWeightBold', component: FormatOutlineWeightBold },
    { name: 'Icon6122191', component: Icon6122191 },
    { name: 'Image26', component: Image26 },
    { name: 'Menu', component: Menu },
    { name: 'Microphone', component: Microphone },
    { name: 'Midoras', component: Midoras },
    { name: 'MidorasIcon', component: MidorasIcon },
    { name: 'MinusSquare', component: MinusSquare },
    { name: 'MoreOptions', component: MoreOptions },
    { name: 'Plus01_5', component: Plus01_5 },
    { name: 'Paperclip', component: Paperclip },
    { name: 'Lightbulb', component: Lightbulb },
    { name: 'Lightning', component: Lightning },
    { name: 'Grid', component: Grid },
    { name: 'Search', component: Search },
    { name: 'Search02', component: Search02 },
    { name: 'Star', component: Star },
    { name: 'Stars', component: Stars },
    { name: 'Scale', component: Scale },
    { name: 'Code', component: Code },
    { name: 'Copy', component: Copy },
    { name: 'LogoOnly', component: LogoOnly },
    { name: 'Logout', component: Logout },
    { name: 'Filters', component: Filters },
    { name: 'PersonFace', component: PersonFace },
    { name: 'AI', component: AI },
  ]

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 flex">
        <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4">
          <button
            onClick={() => setShowIcons(!showIcons)}
            className="w-10 h-10 bg-blue-500 text-white rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors"
          >
            <Grid className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 p-8">
          {showIcons ? (
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Icons Gallery</h1>
              <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                {icons.map((icon, index) => {
                  const IconComponent = icon.component
                  return (
                    <div key={index} className="flex flex-col items-center p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                      <IconComponent className="w-8 h-8 text-gray-700 mb-2" />
                      <span className="text-xs text-gray-600 text-center">{icon.name}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">App Documents</h1>
              <p className="text-lg text-gray-600 mb-8">Simple dashboard view with sidebar navigation.</p>
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <p className="text-gray-500">Click the icon button in the sidebar to view all available icons.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  )
}
