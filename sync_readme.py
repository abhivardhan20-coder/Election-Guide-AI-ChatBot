import os
import glob
from datetime import datetime

def get_next_version():
    """Finds the next available version number for the readme file."""
    version = 1
    while os.path.exists(f"README_v{version}.md"):
        version += 1
    return version

def generate_full_readme():
    version = get_next_version()
    filename = f"README_v{version}.md"
    
    # Project files to include (relative paths)
    source_files = [
        "client/index.html",
        "client/app.html",
        "client/firebase.js",
        "client/src/css/app.css",
        "client/src/js/app.js",
        "client/src/js/api.js",
        "client/src/js/ui.js",
        "client/src/js/auth.js",
        "client/src/js/state.js",
        "client/src/js/login.js",
        "server/index.js",
        "package.json",
        "README.md"
    ]
    
    # Add any extra JS files in src/js
    extra_js = glob.glob("client/src/js/*.js")
    for js in extra_js:
        normalized = js.replace("\\", "/")
        if normalized not in source_files:
            source_files.append(normalized)

    with open(filename, "w", encoding="utf-8") as out:
        out.write(f"# ElectionGuide AI - Code Snapshot (Version {version})\n")
        out.write(f"*Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}*\n\n")
        out.write("This document contains a full snapshot of the application source code for documentation and review purposes.\n\n")
        
        out.write("## Table of Contents\n")
        for file_path in source_files:
            if os.path.exists(file_path):
                anchor = file_path.replace("/", "").replace(".", "").lower()
                out.write(f"- [{file_path}](#{anchor})\n")
        out.write("\n---\n\n")
        
        for file_path in source_files:
            if not os.path.exists(file_path):
                continue
                
            print(f"Adding {file_path}...")
            ext = os.path.splitext(file_path)[1].lower()
            lang = "javascript"
            if ext == ".html": lang = "html"
            elif ext == ".css": lang = "css"
            elif ext == ".json": lang = "json"
            elif ext == ".py": lang = "python"
            elif ext == ".md": lang = "markdown"

            out.write(f"### {file_path}\n")
            out.write(f"```{lang}\n")
            with open(file_path, "r", encoding="utf-8") as f:
                out.write(f.read())
            out.write("\n```\n\n")
            out.write("---\n\n")
            
    print(f"\nSuccessfully generated {filename}")

if __name__ == "__main__":
    generate_full_readme()
