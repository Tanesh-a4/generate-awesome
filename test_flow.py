import json
import requests
import time

def test_generation_flow():
    """Test the complete generation flow"""
    base_url = "http://localhost:5000"
    
    # Step 1: Start generation
    print("🚀 Starting project generation...")
    
    response = requests.post(f"{base_url}/api/generate", json={
        "prompt": "Project Name: Test App\nDescription: A simple test application"
    })
    
    if response.status_code == 200:
        data = response.json()
        request_id = data.get("request_id")
        print(f"✅ Generation started with ID: {request_id}")
        
        # Step 2: Poll for status
        max_attempts = 30  # 5 minutes
        attempt = 0
        
        while attempt < max_attempts:
            print(f"📊 Checking status (attempt {attempt + 1})...")
            
            status_response = requests.get(f"{base_url}/api/status/{request_id}")
            
            if status_response.status_code == 200:
                status_data = status_response.json()
                print(f"Status: {status_data.get('status')} - {status_data.get('message')}")
                
                if status_data.get('status') == 'completed':
                    print("🎉 Generation completed successfully!")
                    
                    # Step 3: Get generated files
                    files_response = requests.get(f"{base_url}/api/files")
                    if files_response.status_code == 200:
                        files_data = files_response.json()
                        print(f"📁 Generated {len(files_data.get('files', []))} files:")
                        for file in files_data.get('files', []):
                            print(f"  - {file.get('name')} ({file.get('path')})")
                    break
                    
                elif status_data.get('status') == 'error':
                    print(f"❌ Generation failed: {status_data.get('message')}")
                    break
                    
            else:
                print(f"⚠️  Status check failed: {status_response.status_code}")
                
            attempt += 1
            time.sleep(10)  # Wait 10 seconds between checks
            
        if attempt >= max_attempts:
            print("⏰ Generation timed out")
            
    else:
        print(f"❌ Failed to start generation: {response.status_code}")
        print(response.text)

if __name__ == "__main__":
    test_generation_flow()