import os
import re

css_dir = 'css'

def fix_border_radius(content):
    # Cards: 16px
    content = re.sub(r'(\.dashboard-panel|\.settings-card|\.stat-card|\.card|\.note-card)[^{]*\{([^}]*)\}?',
        lambda m: m.group(0).replace(re.search(r'border-radius:\s*[^;]+;', m.group(0)).group(0), 'border-radius: 16px;') 
        if re.search(r'border-radius:\s*[^;]+;', m.group(0)) else m.group(0).replace('{', '{\n  border-radius: 16px;'), content)

    # Inputs: 12px
    content = re.sub(r'(input|select|textarea)[^{]*\{([^}]*)\}?',
        lambda m: m.group(0).replace(re.search(r'border-radius:\s*[^;]+;', m.group(0)).group(0), 'border-radius: 12px;') 
        if re.search(r'border-radius:\s*[^;]+;', m.group(0)) else m.group(0).replace('{', '{\n  border-radius: 12px;'), content)
        
    # Badges: 8px
    content = re.sub(r'(\.badge|\.tag|\.status-badge|\.category-pill)[^{]*\{([^}]*)\}?',
        lambda m: m.group(0).replace(re.search(r'border-radius:\s*[^;]+;', m.group(0)).group(0), 'border-radius: 8px;') 
        if re.search(r'border-radius:\s*[^;]+;', m.group(0)) else m.group(0).replace('{', '{\n  border-radius: 8px;'), content)
        
    return content

def fix_spacing(content):
    # Standardize off-grid spacing to 8pt grid (8, 16, 24, 32)
    # Examples: 18px -> 16px, 22px -> 24px, 10px -> 8px, 14px -> 16px
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
        # Use \g<1> for group 1 to avoid group reference issues
        content = re.sub(r'(padding|margin|gap)([^:]*):\s*([^;{}]*)' + old, r'\g<1>\g<2>: \g<3>' + new, content)
    return content

for file in os.listdir(css_dir):
    if not file.endswith('.css'): continue
    path = os.path.join(css_dir, file)
    with open(path, 'r') as f:
        content = f.read()

    content = fix_border_radius(content)
    content = fix_spacing(content)

    with open(path, 'w') as f:
        f.write(content)
