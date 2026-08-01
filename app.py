import subprocess
import sys
import os
import time
import threading

def run_command(command, cwd, name):
    print(f"[{name}] Starting: {command}")
    process = subprocess.Popen(
        command,
        cwd=cwd,
        shell=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True
    )
    
    for line in iter(process.stdout.readline, ''):
        print(f"[{name}] {line.strip()}")
        
    process.stdout.close()
    process.wait()
    print(f"[{name}] Exited with code {process.returncode}")

def main():
    print("======================================================")
    print("⚡ USB Device Control & Monitoring Framework (Dev Mode)")
    print("======================================================")
    
    base_dir = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.join(base_dir, 'backend')
    
    if not os.path.exists(backend_dir):
        print("Error: backend directory not found!")
        sys.exit(1)
        
    # Start Backend Service
    backend_thread = threading.Thread(
        target=run_command,
        args=("npm start", backend_dir, "BACKEND")
    )
    backend_thread.daemon = True
    backend_thread.start()
    
    # Wait a moment for backend to initialize
    time.sleep(2)
    
    # Start Frontend React App
    frontend_thread = threading.Thread(
        target=run_command,
        args=("npm run dev", base_dir, "FRONTEND")
    )
    frontend_thread.daemon = True
    frontend_thread.start()
    
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nShutting down services...")
        sys.exit(0)

if __name__ == "__main__":
    main()
