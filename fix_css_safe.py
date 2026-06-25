import os
import re

css_dir = 'css'

# Safely apply properties to specific selectors
def apply_to_selectors(content, selectors, prop, val):
    for sel in selectors:
        # Match selector precisely: e.g. '.card {' or '.card, .other {'
        # We need to find blocks where the selector is either exact or part of a comma list.
        # But a simple way is just to find the block for that exact selector:
        pattern = r'(?m)(^' + re.escape(sel) + r'\s*\{)([^}]+)(\})'
        def repl(m):
            block = m.group(2)
            if prop in block:
                block = re.sub(r'' + prop + r'\s*:\s*[^;]+;', f'{prop}: {val};', block)
            else:
                block += f'  {prop}: {val};\n'
            return m.group(1) + block + m.group(3)
        content = re.sub(pattern, repl, content)
    return content

def unify_colors(content):
    content = re.sub(r'#38bdf8|#0ea5e9|#4562ed|#4d70ff|#5574ff|var\(--color-primary\)', 'var(--primary)', content, flags=re.IGNORECASE)
    return content

def add_button_transitions(content):
    # Match button styles
    pattern = r'(?m)(^(?:button|\.btn|\.settings-btn)[^{]*\{)([^}]+)(\})'
    def repl(m):
        block = m.group(2)
        if 'transition:' not in block:
            block = f'  transition: all 0.2s ease-in-out;\n' + block
        return m.group(1) + block + m.group(3)
    content = re.sub(pattern, repl, content)
    return content

def fix_border_radius(content):
    # Cards
    cards = ['.dashboard-panel', '.settings-card', '.stat-card', '.card', '.note-card', '.category']
    content = apply_to_selectors(content, cards, 'border-radius', '16px')
    
    # Inputs
    inputs = ['input', 'select', 'textarea', '.add-box input', '.add-box button', '.subtask-input-group input']
    content = apply_to_selectors(content, inputs, 'border-radius', '12px')
    
    # Badges
    badges = ['.badge', '.tag', '.task-time-badge', '.category-pill']
    content = apply_to_selectors(content, badges, 'border-radius', '8px')
    
    return content

def fix_spacing(content):
    replacements = {
        '10px': '8px',
        '14px': '16px',
        '18px': '16px',
        '20px': '24px',
        '22px': '24px',
        '28px': '24px',
        '30px': '32px'
    }
    for old, new in replacements.items():
        content = re.sub(r'(padding|margin|gap)([^:]*):\s*([^;{}]*)' + old, r'\g<1>\g<2>: \g<3>' + new, content)
    return content

for file in os.listdir(css_dir):
    if not file.endswith('.css'): continue
    path = os.path.join(css_dir, file)
    with open(path, 'r') as f:
        content = f.read()

    if file == 'variables.css':
        content = content.replace(':root {', ':root {\n  --primary: #5574ff;')

    content = unify_colors(content)
    content = add_button_transitions(content)
    content = fix_border_radius(content)
    content = fix_spacing(content)

    with open(path, 'w') as f:
        f.write(content)
