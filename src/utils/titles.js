export const BUILDER_TITLES = {
  'solidity': 'Onchain Architect 🏗️',
  'frontend': 'Interface Conjurer ✨',
  'backend': 'Infra Whisperer 🛠️',
  'ai-ml': 'Model Tamer 🤖',
  'fullstack': 'Digital Alchemist ⚗️',
  'devrel': 'Community Catalyst 🔥',
  'design': 'Pixel Philosopher 🎨',
  'product': 'Vision Merchant 🧭',
  'default': 'Builder Extraordinaire 🚀'
};

export const STACK_OPTIONS = [
  { value: 'solidity', label: 'Solidity / Smart Contracts' },
  { value: 'frontend', label: 'Frontend / UI' },
  { value: 'backend', label: 'Backend / Infra' },
  { value: 'ai-ml', label: 'AI / ML' },
  { value: 'fullstack', label: 'Fullstack' },
  { value: 'devrel', label: 'DevRel / Community' },
  { value: 'design', label: 'Design / UX' },
  { value: 'product', label: 'Product / Strategy' }
];

export const FUN_VIBES = [
  { value: 'sleep', label: 'Shipping on 3hrs sleep ☕' },
  { value: 'agents', label: 'Building AI Agents 🤖' },
  { value: 'ocean', label: 'Hacking by the ocean 🌊' },
  { value: 'output', label: 'Zero sleep, 100% output ⚡' },
  { value: 'coconut', label: 'Sipping tender coconut 🌴' },
  { value: 'all-nighter', label: 'Master of all-nighters 🌙' }
];

export function getBuilderTitle(stackKey) {
  return BUILDER_TITLES[stackKey] || BUILDER_TITLES['default'];
}
