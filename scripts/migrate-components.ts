import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const COMPONENTS = {
  button: [
    {
      name: 'primary',
      description: 'Primary action button',
      code: `export default function Button() {
  return (
    <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition">
      Click me
    </button>
  );
}`,
    },
    {
      name: 'secondary',
      description: 'Secondary action button',
      code: `export default function Button() {
  return (
    <button className="px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg transition">
      Secondary
    </button>
  );
}`,
    },
    {
      name: 'outline',
      description: 'Outline button style',
      code: `export default function Button() {
  return (
    <button className="px-6 py-3 border-2 border-blue-600 text-blue-400 hover:bg-blue-600/10 font-semibold rounded-lg transition">
      Outline
    </button>
  );
}`,
    },
  ],
  card: [
    {
      name: 'basic',
      description: 'Basic card component',
      code: `export default function Card() {
  return (
    <div className="p-6 bg-slate-800 border border-slate-700 rounded-lg">
      <h3 className="text-xl font-bold text-white mb-2">Card Title</h3>
      <p className="text-slate-400">This is a basic card component.</p>
    </div>
  );
}`,
    },
    {
      name: 'elevated',
      description: 'Elevated card with shadow',
      code: `export default function Card() {
  return (
    <div className="p-8 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl border border-slate-700">
      <h3 className="text-2xl font-bold text-white mb-3">Elevated Card</h3>
      <p className="text-slate-300">This is an elevated card with shadow.</p>
    </div>
  );
}`,
    },
    {
      name: 'interactive',
      description: 'Interactive card component',
      code: `export default function Card() {
  const [hovered, setHovered] = useState(false);
  return (
    <div 
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={\`p-6 bg-slate-800 rounded-lg cursor-pointer transition \${hovered ? 'border-blue-500 bg-slate-700' : 'border-slate-700'} border\`}
    >
      <h3 className="text-lg font-bold text-white">Interactive Card</h3>
      <p className="text-slate-400 mt-2">Hover to interact</p>
    </div>
  );
}`,
    },
  ],
  input: [
    {
      name: 'text',
      description: 'Text input field',
      code: `export default function Input() {
  return (
    <input 
      type="text"
      placeholder="Enter text..."
      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-blue-500 outline-none transition"
    />
  );
}`,
    },
    {
      name: 'email',
      description: 'Email input field',
      code: `export default function Input() {
  return (
    <input 
      type="email"
      placeholder="Enter email..."
      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-blue-500 outline-none transition"
    />
  );
}`,
    },
    {
      name: 'textarea',
      description: 'Large text area',
      code: `export default function TextArea() {
  return (
    <textarea 
      placeholder="Enter message..."
      rows={4}
      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-blue-500 outline-none transition resize-none"
    />
  );
}`,
    },
  ],
  alert: [
    {
      name: 'success',
      description: 'Success alert message',
      code: `export default function Alert() {
  return (
    <div className="p-4 bg-green-900/20 border border-green-700 rounded-lg">
      <p className="text-green-400 font-semibold">✓ Success!</p>
      <p className="text-green-300 text-sm">Operation completed successfully.</p>
    </div>
  );
}`,
    },
    {
      name: 'error',
      description: 'Error alert message',
      code: `export default function Alert() {
  return (
    <div className="p-4 bg-red-900/20 border border-red-700 rounded-lg">
      <p className="text-red-400 font-semibold">✕ Error!</p>
      <p className="text-red-300 text-sm">Something went wrong.</p>
    </div>
  );
}`,
    },
    {
      name: 'warning',
      description: 'Warning alert message',
      code: `export default function Alert() {
  return (
    <div className="p-4 bg-yellow-900/20 border border-yellow-700 rounded-lg">
      <p className="text-yellow-400 font-semibold">⚠ Warning</p>
      <p className="text-yellow-300 text-sm">Please be careful with this action.</p>
    </div>
  );
}`,
    },
    {
      name: 'info',
      description: 'Info alert message',
      code: `export default function Alert() {
  return (
    <div className="p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
      <p className="text-blue-400 font-semibold">ℹ Info</p>
      <p className="text-blue-300 text-sm">Here is some useful information.</p>
    </div>
  );
}`,
    },
  ],
  badge: [
    {
      name: 'default',
      description: 'Default badge',
      code: `export default function Badge() {
  return (
    <span className="px-3 py-1 bg-slate-700 text-slate-200 text-sm font-medium rounded-full">
      Badge
    </span>
  );
}`,
    },
    {
      name: 'success',
      description: 'Success badge',
      code: `export default function Badge() {
  return (
    <span className="px-3 py-1 bg-green-600/20 text-green-300 text-sm font-medium rounded-full">
      Success
    </span>
  );
}`,
    },
    {
      name: 'error',
      description: 'Error badge',
      code: `export default function Badge() {
  return (
    <span className="px-3 py-1 bg-red-600/20 text-red-300 text-sm font-medium rounded-full">
      Error
    </span>
  );
}`,
    },
  ],
  modal: [
    {
      name: 'basic',
      description: 'Basic modal dialog',
      code: `export default function Modal() {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-slate-800 rounded-lg p-8 max-w-md border border-slate-700">
        <h2 className="text-2xl font-bold text-white mb-4">Modal Dialog</h2>
        <p className="text-slate-300 mb-6">This is a basic modal dialog.</p>
        <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
          Close
        </button>
      </div>
    </div>
  );
}`,
    },
    {
      name: 'confirm',
      description: 'Confirmation modal',
      code: `export default function Modal() {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-slate-800 rounded-lg p-8 max-w-md border border-slate-700">
        <h2 className="text-2xl font-bold text-white mb-4">Confirm Action?</h2>
        <p className="text-slate-300 mb-6">Are you sure you want to continue?</p>
        <div className="flex gap-3">
          <button className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition">
            Cancel
          </button>
          <button className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}`,
    },
  ],
};

async function main() {
  console.log('Starting data migration...');

  for (const [category, components] of Object.entries(COMPONENTS)) {
    for (const comp of components) {
      await prisma.component.upsert({
        where: { category_name: { category, name: comp.name } },
        update: {
          description: comp.description,
          code: comp.code,
        },
        create: {
          category,
          name: comp.name,
          description: comp.description,
          code: comp.code,
        },
      });
      console.log(`✓ ${category}/${comp.name}`);
    }
  }

  console.log('Migration completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
