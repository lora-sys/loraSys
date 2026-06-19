#!/usr/bin/env python3
"""Fix orphaned wrapper in work section."""
import sys
path = '/Users/lora/repos/loraSys/src/routes/+page.svelte'

with open(path, 'r') as f:
    lines = f.readlines()

# Lines 114-116 have an orphaned form wrapper. Replace them with just a closing </div>
# that matches the indent of line 110.
# Line 113: {/each}
# Line 114: <div class="mt-8 w-full max-w-md mx-auto">
# Line 115: (empty)
# Line 116: </div>
# We want to replace lines 113-116 with: {/each}\n</div> (</div> at same indent as line 110)

print(f"Total lines: {len(lines)}")
for i in range(max(0, 109), min(len(lines), 118)):
    print(f"Line {i+1}: {repr(lines[i])}")

# Fix: line 113 (idx 112) currently ends with {/each}\n
# Remove lines 113-116 (idx 112-115) and replace with {/each}\n + appropriate indentation

# Get indent of line 110 (idx 109) which opens the space-y-0.5 div
line_110_indent = lines[109][:len(lines[109]) - len(lines[109].lstrip('\t'))]
print(f"Line 110 indent: {len(line_110_indent)} tabs")

# Replace indexes 112-116 (lines 113-117) with:
# line 113: {/each}\n
# line 114: <indent></div>\n
# line 117: </BlurFade>\n
new_content = lines[:112]
new_content.append(lines[112])  # keep {/each}
new_content.append(line_110_indent + '</div>\n')  # closing div
new_content.extend(lines[115:])  # skip lines 113-115 (0-indexed 112-114), keep rest

with open(path, 'w') as f:
    f.writelines(new_content)

print("Done! Fixed work section.")
