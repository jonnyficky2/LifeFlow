import os
import re

css_dir = 'css'
for file in os.listdir(css_dir):
    if not file.endswith('.css'): continue
    path = os.path.join(css_dir, file)
    with open(path, 'r') as f:
        content = f.read()

    # 1. Unify colors
    content = re.sub(r'#38bdf8|#0ea5e9|#4562ed|#4d70ff|#5574ff|var\(--color-primary\)', 'var(--primary)', content, flags=re.IGNORECASE)
    
    # Define --primary in variables.css if not there
    if file == 'variables.css':
        content = content.replace(':root {', ':root {\n  --primary: #5574ff;')

    # 3. Add hover transitions to buttons
    # We look for button { or .btn { and add transition if not present
    def add_transition(match):
        block = match.group(0)
        if 'transition:' not in block:
            return block.replace('{', '{\n  transition: all 0.2s ease-in-out;')
        return block
    content = re.sub(r'(?i)(?:button|\.btn|\.settings-btn)[^{]*\{[^\}]*\}', add_transition, content)

    with open(path, 'w') as f:
        f.write(content)
