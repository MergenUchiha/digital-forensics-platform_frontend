// src/components/ThemeTest.tsx
import { useTheme } from '@/contexts/ThemeContext';

export const ThemeTest = () => {
  const { theme } = useTheme();

  // Получаем значения CSS переменных
  const getVariableValue = (varName: string) => {
    if (typeof window === 'undefined') return 'N/A';
    return getComputedStyle(document.documentElement)
      .getPropertyValue(varName)
      .trim();
  };

  const variables = [
    { name: '--color-text-primary', label: 'Text Primary' },
    { name: '--color-text-secondary', label: 'Text Secondary' },
    { name: '--color-bg-primary', label: 'BG Primary' },
    { name: '--color-bg-secondary', label: 'BG Secondary' },
    { name: '--color-border-primary', label: 'Border Primary' },
  ];

  return (
    <div className="fixed bottom-4 right-4 w-96 p-4 bg-bg-secondary border-2 border-border-primary rounded-lg shadow-2xl z-50">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-text-primary mb-2">
          🔍 Theme Diagnostic
        </h3>
        <p className="text-sm text-text-secondary">
          Current theme: <strong className="text-cyber-500">{theme}</strong>
        </p>
      </div>

      <div className="space-y-2 mb-4">
        <h4 className="text-sm font-semibold text-text-primary">CSS Variables:</h4>
        {variables.map(({ name, label }) => (
          <div key={name} className="text-xs">
            <span className="text-text-tertiary">{label}:</span>{' '}
            <code className="text-cyber-500 font-mono">
              {getVariableValue(name) || '❌ NOT FOUND'}
            </code>
          </div>
        ))}
      </div>

      <div className="space-y-2 mb-4">
        <h4 className="text-sm font-semibold text-text-primary">Visual Test:</h4>
        
        {/* Test boxes */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 bg-bg-primary border border-border-primary rounded">
            <p className="text-xs text-text-primary">Primary BG</p>
            <p className="text-xs text-text-secondary">Secondary text</p>
          </div>
          
          <div className="p-2 bg-bg-secondary border border-border-secondary rounded">
            <p className="text-xs text-text-primary">Secondary BG</p>
            <p className="text-xs text-text-muted">Muted text</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-text-primary">Expected Values:</h4>
        <div className="text-xs space-y-1">
          {theme === 'light' ? (
            <>
              <p className="text-text-tertiary">✅ Text Primary: <code className="text-green-600">17 24 39</code></p>
              <p className="text-text-tertiary">✅ BG Primary: <code className="text-green-600">249 250 251</code></p>
            </>
          ) : (
            <>
              <p className="text-text-tertiary">✅ Text Primary: <code className="text-green-600">243 244 246</code></p>
              <p className="text-text-tertiary">✅ BG Primary: <code className="text-green-600">3 7 18</code></p>
            </>
          )}
        </div>
      </div>

      <button
        onClick={() => {
          const root = document.documentElement;
          console.log('=== THEME DEBUG INFO ===');
          console.log('Current theme:', theme);
          console.log('HTML classes:', root.className);
          console.log('Computed styles:', {
            textPrimary: getComputedStyle(root).getPropertyValue('--color-text-primary'),
            bgPrimary: getComputedStyle(root).getPropertyValue('--color-bg-primary'),
            borderPrimary: getComputedStyle(root).getPropertyValue('--color-border-primary'),
          });
          console.log('======================');
        }}
        className="w-full mt-3 px-3 py-1.5 bg-cyber-500 hover:bg-cyber-600 text-white text-xs rounded transition-colors"
      >
        Log Debug Info to Console
      </button>
    </div>
  );
};