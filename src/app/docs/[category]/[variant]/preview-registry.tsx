'use client';

import React from 'react';

// 1. 프리뷰용 컴포넌트 정의
const PrimaryButton = () => (
  <button className="px-4 py-2 bg-zinc-100 text-zinc-950 rounded-md font-medium hover:bg-zinc-200 transition-colors border border-zinc-100">
    Primary Button
  </button>
);

const SecondaryButton = () => (
  <button className="px-4 py-2 bg-zinc-800 text-zinc-100 rounded-md font-medium hover:bg-zinc-700 transition-colors border border-zinc-700">
    Secondary Button
  </button>
);

const OutlineButton = () => (
  <button className="px-4 py-2 bg-transparent text-zinc-100 rounded-md font-medium hover:bg-zinc-800 transition-colors border border-zinc-700">
    Outline Button
  </button>
);

const GhostButton = () => (
  <button className="px-4 py-2 text-zinc-300 rounded-md font-medium hover:bg-zinc-800 transition-colors border border-zinc-700/0 hover:border-zinc-700">
    Ghost Button
  </button>
);

const DestructiveButton = () => (
  <button className="px-4 py-2 bg-red-500/10 text-red-500 rounded-md font-medium hover:bg-red-500/20 transition-colors border border-red-500/20">
    Destructive
  </button>
);

const LoadingButton = () => (
  <button disabled className="px-4 py-2 bg-zinc-800 text-zinc-400 rounded-md font-medium cursor-not-allowed flex items-center gap-2 border border-zinc-700">
    <svg className="animate-spin h-4 w-4 text-zinc-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    Loading...
  </button>
);

const GradientButton = () => (
  <button className="px-4 py-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-md font-medium hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/20 border-0">
    Gradient
  </button>
);

const NeumorphicButton = () => (
  <button className="px-6 py-3 bg-zinc-900 text-zinc-100 rounded-2xl font-medium shadow-[5px_5px_10px_#09090b,-5px_-5px_10px_#27272a] hover:shadow-[2px_2px_5px_#09090b,-2px_-2px_5px_#27272a] active:shadow-[inset_5px_5px_10px_#09090b,inset_-5px_-5px_10px_#27272a] transition-all">
    Neumorphic Button
  </button>
);

const SoftButton = () => (
  <button className="px-4 py-2 bg-indigo-500/10 text-indigo-400 rounded-md font-medium hover:bg-indigo-500/20 transition-colors border border-indigo-500/10">
    Soft Button
  </button>
);

const DefaultCard = () => (
  <div className="p-6 rounded-lg border border-zinc-800 bg-zinc-900 max-w-sm w-full">
    <h3 className="text-lg font-semibold text-zinc-50 mb-2">Card Title</h3>
    <p className="text-zinc-400">This is a default card component with clean styling.</p>
  </div>
);

const ElevatedCard = () => (
  <div className="p-6 rounded-lg bg-zinc-900 shadow-xl shadow-black/50 max-w-sm w-full border border-zinc-800/50">
    <h3 className="text-lg font-semibold text-zinc-50 mb-2">Elevated Card</h3>
    <p className="text-zinc-400">This card has enhanced depth with shadow effects.</p>
  </div>
);

const ImageCard = () => (
  <div className="rounded-xl border border-zinc-800 bg-zinc-900 max-w-sm w-full overflow-hidden">
    <div className="h-48 bg-zinc-800 w-full relative flex items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900">
       <svg className="w-12 h-12 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
       </svg>
    </div>
    <div className="p-5">
      <h3 className="text-lg font-semibold text-zinc-50 mb-1">Project Alpha</h3>
      <p className="text-zinc-400 text-sm mb-4">A brief description of the project goes here.</p>
      <button className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">Read more &rarr;</button>
    </div>
  </div>
);

const ProfileCard = () => (
  <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900 max-w-xs w-full flex flex-col items-center text-center">
    <div className="w-20 h-20 rounded-full bg-zinc-800 mb-4 border-2 border-zinc-700 flex items-center justify-center text-zinc-500 text-xl font-bold">AJ</div>
    <h3 className="text-lg font-semibold text-zinc-50">Alex Johnson</h3>
    <p className="text-zinc-500 text-sm mb-4">Software Engineer</p>
    <div className="flex gap-2 w-full">
      <button className="flex-1 py-2 bg-zinc-100 text-zinc-950 rounded-md text-sm font-medium hover:bg-zinc-200 transition-colors">Follow</button>
      <button className="flex-1 py-2 border border-zinc-700 text-zinc-300 rounded-md text-sm font-medium hover:bg-zinc-800 transition-colors">Message</button>
    </div>
  </div>
);

const StatsCard = () => (
  <div className="p-6 rounded-lg border border-zinc-800 bg-zinc-900 w-64">
    <p className="text-zinc-500 text-sm font-medium mb-1">Total Revenue</p>
    <div className="flex items-baseline gap-2">
      <h3 className="text-3xl font-bold text-zinc-50">$45,231</h3>
      <span className="text-emerald-500 text-sm font-medium flex items-center">
        <svg className="w-3 h-3 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
        20.1%
      </span>
    </div>
  </div>
);

const InputField = () => (
  <input 
    type="text" 
    placeholder="Enter text..." 
    className="px-4 py-2 bg-zinc-900 text-zinc-50 border border-zinc-800 rounded-md focus:border-zinc-600 focus:outline-none transition-colors w-full max-w-xs placeholder:text-zinc-600" 
  />
);

const SearchInput = () => (
  <div className="relative w-full max-w-xs">
    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
    <input 
      type="text" 
      placeholder="Search..." 
      className="pl-10 pr-4 py-2 bg-zinc-900 text-zinc-50 border border-zinc-800 rounded-md focus:border-zinc-600 focus:outline-none transition-colors w-full placeholder:text-zinc-600" 
    />
  </div>
);

const LabelInput = () => (
  <div className="w-full max-w-xs space-y-1.5">
    <label className="text-sm font-medium text-zinc-400">Email Address</label>
    <input 
      type="email" 
      placeholder="john@example.com" 
      className="px-4 py-2 bg-zinc-900 text-zinc-50 border border-zinc-800 rounded-md focus:border-zinc-600 focus:outline-none transition-colors w-full placeholder:text-zinc-600" 
    />
  </div>
);

const ErrorInput = () => (
  <div className="w-full max-w-xs space-y-1.5">
    <label className="text-sm font-medium text-red-400">Username</label>
    <input 
      type="text" 
      defaultValue="taken_username"
      className="px-4 py-2 bg-zinc-900 text-zinc-50 border border-red-500/50 rounded-md focus:outline-none w-full" 
    />
    <p className="text-xs text-red-500">This username is already taken.</p>
  </div>
);

const BasicModal = () => (
  <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6 shadow-2xl w-96">
    <h2 className="text-xl font-bold text-zinc-50 mb-2">Modal Title</h2>
    <p className="text-zinc-400 mb-6">This is a basic modal dialog component.</p>
    <div className="flex gap-3 justify-end">
      <button className="px-4 py-2 text-zinc-300 rounded-md font-medium hover:bg-zinc-800 transition-colors border border-zinc-700">
        Cancel
      </button>
      <button className="px-4 py-2 bg-zinc-100 text-zinc-950 rounded-md font-medium hover:bg-zinc-200 transition-colors border border-zinc-100">
        Confirm
      </button>
    </div>
  </div>
);

// --- Badges ---

const DefaultBadge = () => (
  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-800 text-zinc-300 border border-zinc-700">
    Default
  </span>
);

const SuccessBadge = () => (
  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
    Success
  </span>
);

const WarningBadge = () => (
  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20">
    Warning
  </span>
);

const ErrorBadge = () => (
  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/20">
    Error
  </span>
);

// --- Alerts ---

const InfoAlert = () => (
  <div className="p-4 rounded-md bg-blue-500/10 border border-blue-500/20 flex gap-3 max-w-md w-full">
    <svg className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <div>
      <h4 className="text-sm font-medium text-blue-500">Update Available</h4>
      <p className="text-sm text-blue-500/80 mt-1">A new version is available for download.</p>
    </div>
  </div>
);

const SuccessAlert = () => (
  <div className="p-4 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex gap-3 max-w-md w-full">
    <svg className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <div>
      <h4 className="text-sm font-medium text-emerald-500">Success</h4>
      <p className="text-sm text-emerald-500/80 mt-1">Changes saved successfully.</p>
    </div>
  </div>
);

const WarningAlert = () => (
  <div className="p-4 rounded-md bg-amber-500/10 border border-amber-500/20 flex gap-3 max-w-md w-full">
    <svg className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
    <div>
      <h4 className="text-sm font-medium text-amber-500">Warning</h4>
      <p className="text-sm text-amber-500/80 mt-1">Your account subscription expires soon.</p>
    </div>
  </div>
);

const ErrorAlert = () => (
  <div className="p-4 rounded-md bg-red-500/10 border border-red-500/20 flex gap-3 max-w-md w-full">
    <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <div>
      <h4 className="text-sm font-medium text-red-500">Error</h4>
      <p className="text-sm text-red-500/80 mt-1">Failed to connect to the server.</p>
    </div>
  </div>
);

// --- Loaders ---

const LinearLoader = () => (
  <div className="w-64 space-y-2">
    <div className="flex justify-between text-xs text-zinc-400">
      <span>Uploading...</span>
      <span>60%</span>
    </div>
    <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
      <div className="h-full bg-zinc-100 w-3/5 rounded-full"></div>
    </div>
  </div>
);

const CircularLoader = () => (
  <div className="flex flex-col items-center gap-4">
    <div className="relative w-12 h-12">
      <div className="absolute inset-0 border-4 border-zinc-800 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-zinc-100 rounded-full border-t-transparent animate-spin"></div>
    </div>
    <span className="text-sm text-zinc-500 font-medium">Processing</span>
  </div>
);

const SkeletonLoader = () => (
  <div className="w-full max-w-sm p-4 border border-zinc-800 rounded-xl bg-zinc-900/50">
    <div className="flex space-x-4 animate-pulse">
      <div className="rounded-full bg-zinc-800 h-10 w-10"></div>
      <div className="flex-1 space-y-3 py-1">
        <div className="h-2 bg-zinc-800 rounded w-3/4"></div>
        <div className="space-y-2">
          <div className="h-2 bg-zinc-800 rounded"></div>
          <div className="h-2 bg-zinc-800 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  </div>
);

// --- Toggles ---

const ToggleSwitch = () => (
  <label className="inline-flex items-center cursor-pointer group">
    <input type="checkbox" className="sr-only peer" defaultChecked />
    <div className="relative w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-zinc-100"></div>
    <span className="ms-3 text-sm font-medium text-zinc-400 group-hover:text-zinc-300 transition-colors">Airplane Mode</span>
  </label>
);

const Checkbox = () => (
  <label className="flex items-center space-x-3 cursor-pointer group">
    <div className="relative flex items-center">
      <input type="checkbox" className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-zinc-700 bg-zinc-800 checked:border-zinc-100 checked:bg-zinc-100 transition-all" defaultChecked />
      <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none opacity-0 peer-checked:opacity-100 text-zinc-950 transition-opacity" viewBox="0 0 14 14" fill="none">
        <path d="M3 8L6 11L11 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
    <span className="text-sm font-medium text-zinc-400 group-hover:text-zinc-300 transition-colors">I agree to terms</span>
  </label>
);

// --- Tabs ---

const Tabs = () => (
  <div className="w-full max-w-md">
    <div className="flex space-x-1 rounded-xl bg-zinc-900/50 p-1 border border-zinc-800">
      <button className="w-full rounded-lg bg-zinc-800 py-2.5 text-sm font-medium leading-5 text-zinc-100 shadow ring-1 ring-zinc-700/50">
        Overview
      </button>
      <button className="w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-zinc-400 hover:bg-zinc-800/50 hover:text-white transition-colors">
        Activity
      </button>
      <button className="w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-zinc-400 hover:bg-zinc-800/50 hover:text-white transition-colors">
        Settings
      </button>
    </div>
  </div>
);

// --- Avatars ---

const AvatarGroup = () => (
  <div className="flex items-center gap-4">
    <div className="flex -space-x-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="inline-flex h-10 w-10 items-center justify-center rounded-full ring-2 ring-zinc-950 bg-zinc-800 text-xs font-medium text-zinc-300">
          U{i}
        </div>
      ))}
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-full ring-2 ring-zinc-950 bg-zinc-900 text-xs font-medium text-zinc-400 border border-zinc-800">
        +5
      </div>
    </div>
    <span className="text-sm text-zinc-500">Active users</span>
  </div>
);

// 2. 컴포넌트 레지스트리 등록 (단수/복수형 모두 지원)
const COMPONENT_REGISTRY: Record<string, React.FC> = {
  // Buttons
  'buttons/primary': PrimaryButton, 'button/primary': PrimaryButton,
  'buttons/secondary': SecondaryButton, 'button/secondary': SecondaryButton,
  'buttons/outline': OutlineButton, 'button/outline': OutlineButton,
  'buttons/ghost': GhostButton, 'button/ghost': GhostButton,
  'buttons/destructive': DestructiveButton, 'button/destructive': DestructiveButton,
  'buttons/loading': LoadingButton, 'button/loading': LoadingButton,
  'buttons/gradient': GradientButton, 'button/gradient': GradientButton,
  'buttons/neumorphic': NeumorphicButton, 'button/neumorphic': NeumorphicButton,
  'buttons/soft': SoftButton, 'button/soft': SoftButton,
  
  // Cards
  'cards/default': DefaultCard, 'card/default': DefaultCard,
  'cards/elevated': ElevatedCard, 'card/elevated': ElevatedCard,
  'cards/image': ImageCard, 'card/image': ImageCard,
  'cards/profile': ProfileCard, 'card/profile': ProfileCard,
  'cards/stats': StatsCard, 'card/stats': StatsCard,
  
  // Inputs
  'inputs/text': InputField, 'input/text': InputField,
  'inputs/search': SearchInput, 'input/search': SearchInput,
  'inputs/label': LabelInput, 'input/label': LabelInput,
  'inputs/error': ErrorInput, 'input/error': ErrorInput,
  
  // Badges
  'badges/default': DefaultBadge, 'badge/default': DefaultBadge,
  'badges/success': SuccessBadge, 'badge/success': SuccessBadge,
  'badges/warning': WarningBadge, 'badge/warning': WarningBadge,
  'badges/error': ErrorBadge, 'badge/error': ErrorBadge,

  // Alerts
  'alerts/info': InfoAlert, 'alert/info': InfoAlert,
  'alerts/success': SuccessAlert, 'alert/success': SuccessAlert,
  'alerts/warning': WarningAlert, 'alert/warning': WarningAlert,
  'alerts/error': ErrorAlert, 'alert/error': ErrorAlert,
  
  // Modals
  'modals/basic': BasicModal, 'modal/basic': BasicModal,

  // Loaders
  'loaders/linear': LinearLoader, 'loader/linear': LinearLoader,
  'loaders/circular': CircularLoader, 'loader/circular': CircularLoader,
  'loaders/skeleton': SkeletonLoader, 'loader/skeleton': SkeletonLoader,

  // Toggles
  'toggles/switch': ToggleSwitch, 'toggle/switch': ToggleSwitch,
  'toggles/checkbox': Checkbox, 'toggle/checkbox': Checkbox,

  // Others
  'tabs/default': Tabs, 'tab/default': Tabs,
  'avatars/group': AvatarGroup, 'avatar/group': AvatarGroup,
};

export default function PreviewComponent({ category, variant }: { category: string; variant: string }) {
  // URL 디코딩 및 소문자 변환으로 매칭 정확도 향상
  const normalizedCategory = decodeURIComponent(category).toLowerCase();
  const normalizedVariant = decodeURIComponent(variant).toLowerCase();
  const slug = `${normalizedCategory}/${normalizedVariant}`;
  
  const Component = COMPONENT_REGISTRY[slug];

  if (!Component) {
    return (
      <div className="text-center p-6">
        <p className="text-zinc-400 mb-2">No preview found for:</p>
        <code className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded text-zinc-300 text-sm block w-fit mx-auto mb-4">
          {slug}
        </code>
        <div className="text-zinc-500 text-xs space-y-2">
          <p>Make sure to register this component in <strong>src/app/docs/[category]/[variant]/preview-registry.tsx</strong></p>
        </div>
      </div>
    );
  }

  return <Component />;
}