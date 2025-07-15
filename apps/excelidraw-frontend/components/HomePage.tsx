 
 "use client"
 import React from 'react';
import { 
  Square, 
  Circle, 
  Minus, 
  Type, 
  MousePointer, 
  Pencil, 
  Download,
  Upload,
  Settings,
  Zap,
  Users,
  Undo,
  Redo,
  Trash2,
  Hand
} from 'lucide-react';

import { useRouter } from 'next/navigation';

 export default function HomePage (){
   

const router = useRouter()
 const handleSignupClick = () => {
    router.push("/signup"); 
  };

  const tools = [
    { id: 'select', icon: MousePointer, label: 'Select' },
    { id: 'hand', icon: Hand, label: 'Hand' },
    { id: 'rectangle', icon: Square, label: 'Rectangle' },
    { id: 'circle', icon: Circle, label: 'Circle' },
    { id: 'line', icon: Minus, label: 'Line' },
    { id: 'pencil', icon: Pencil, label: 'Draw' },
    { id: 'text', icon: Type, label: 'Text' },
  ];

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">DrawBoard</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Undo className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Redo className="w-5 h-5 text-gray-600" />
            </button>
            <div className="w-px h-6 bg-gray-300 mx-2"></div>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Upload className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Download className="w-5 h-5 text-gray-600" />
            </button>
            <button  className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Trash2 className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
          <button className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
            <Users className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-700">Share</span>
          </button>
          <button 
            onClick={handleSignupClick}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium shadow-sm"
          >
            Sign Up
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Toolbar */}
        <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 space-y-2 shadow-sm">
          {tools.map((tool, index) => {
            const IconComponent = tool.icon;
            return (
              <button
                key={tool.id}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 group relative ${
                  index === 0
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
                title={tool.label}
              >
                <IconComponent className="w-5 h-5" />
                
                {/* Tooltip */}
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                  {tool.label}
                </div>
              </button>
            );
          })}
        </div>

        {/* Canvas Area */}
        <div className="flex-1 relative bg-white">
          {/* Grid Background */}
          <div 
            className="absolute inset-0 opacity-50"
            style={{
              backgroundImage: `
                radial-gradient(circle, #e5e7eb 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}
          ></div>
          
          {/* Welcome Message */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to DrawBoard</h2>
              <p className="text-gray-600 mb-6 max-w-md">
                Create amazing diagrams, sketches, and collaborate with your team in real-time
              </p>
              <button 
                onClick={handleSignupClick}
                className="px-6 py-3 bg-blue-600 cursor-pointer hover:bg-blue-700 text-white rounded-lg transition-colors font-medium shadow-sm"
              >
                Get Started
              </button>
            </div>
          </div>

          {/* Floating Action Panel */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
            <div className="bg-white rounded-full shadow-lg border border-gray-200 px-4 py-2 flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Ready to draw</span>
              </div>
              <div className="w-px h-4 bg-gray-300"></div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Zoom: 100%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

 }


