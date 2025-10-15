from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from agent.graph import agent
import os
import threading
import traceback

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Store generation results and status
generation_status = {}
generation_lock = threading.Lock()

def run_agent(prompt, request_id):
    """Run the agent in a background thread"""
    try:
        with generation_lock:
            generation_status[request_id] = {
                "status": "processing",
                "message": "Generating project...",
                "result": None,
                "error": None
            }
        
        result = agent.invoke(
            {"user_prompt": prompt},
            {"recursion_limit": 100}
        )
        
        with generation_lock:
            generation_status[request_id] = {
                "status": "completed",
                "message": "Project generated successfully!",
                "result": result,
                "error": None
            }
    except Exception as e:
        with generation_lock:
            generation_status[request_id] = {
                "status": "error",
                "message": "Failed to generate project",
                "result": None,
                "error": str(e)
            }
        traceback.print_exc()

@app.route('/api/generate', methods=['POST'])
def generate_project():
    """Endpoint to generate a project from a prompt"""
    data = request.json
    prompt = data.get('prompt', '')
    
    if not prompt:
        return jsonify({"error": "Prompt is required"}), 400
    
    # Generate a unique request ID
    import uuid
    request_id = str(uuid.uuid4())
    
    # Start generation in background
    thread = threading.Thread(target=run_agent, args=(prompt, request_id))
    thread.daemon = True
    thread.start()
    
    return jsonify({
        "request_id": request_id,
        "status": "processing",
        "message": "Generation started"
    })

@app.route('/api/status/<request_id>', methods=['GET'])
def get_status(request_id):
    """Check the status of a generation request"""
    with generation_lock:
        status = generation_status.get(request_id)
    
    if not status:
        return jsonify({"error": "Request not found"}), 404
    
    return jsonify(status)
@app.route('/api/files', methods=['GET'])
def list_project_files():
    """List all files in the generated project directory"""
    project_dir = os.path.join(os.path.dirname(__file__), 'agent', 'generated_project')
    
    if not os.path.exists(project_dir):
        return jsonify({"files": []})
    
    files = []
    for root, dirs, filenames in os.walk(project_dir):
        for filename in filenames:
            filepath = os.path.join(root, filename)
            rel_path = os.path.relpath(filepath, project_dir)
            files.append({
                "name": filename,
                "path": rel_path.replace('\\', '/'),
                "fullPath": filepath
            })
    
    return jsonify({"files": files})

@app.route('/api/file/<path:filepath>', methods=['GET'])
def get_file_content(filepath):
    """Get the content of a specific file"""
    project_dir = os.path.join(os.path.dirname(__file__), 'agent', 'generated_project')
    full_path = os.path.join(project_dir, filepath)
    
    if not os.path.exists(full_path):
        return jsonify({"error": "File not found"}), 404
    
    try:
        with open(full_path, 'r', encoding='utf-8') as f:
            content = f.read()
        return jsonify({
            "path": filepath,
            "content": content
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/file/<path:filepath>', methods=['PUT'])
def update_file_content(filepath):
    """Update the content of a specific file"""
    project_dir = os.path.join(os.path.dirname(__file__), 'agent', 'generated_project')
    full_path = os.path.join(project_dir, filepath)
    
    if not os.path.exists(full_path):
        return jsonify({"error": "File not found"}), 404
    
    data = request.json
    content = data.get('content', '')
    
    try:
        with open(full_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return jsonify({
            "message": "File updated successfully",
            "path": filepath
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/file/<path:filepath>', methods=['DELETE'])
def delete_file(filepath):
    """Delete a specific file"""
    project_dir = os.path.join(os.path.dirname(__file__), 'agent', 'generated_project')
    full_path = os.path.join(project_dir, filepath)
    
    if not os.path.exists(full_path):
        return jsonify({"error": "File not found"}), 404
    
    try:
        os.remove(full_path)
        return jsonify({
            "message": "File deleted successfully",
            "path": filepath
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/preview/')
@app.route('/preview/<path:filepath>')
def preview_project(filepath='index.html'):
    """Serve generated project files for preview with proper MIME types"""
    project_dir = os.path.join(os.path.dirname(__file__), 'agent', 'generated_project')
    
    # If no filepath or root, try to serve index.html
    if not filepath or filepath == '':
        filepath = 'index.html'
    
    full_path = os.path.join(project_dir, filepath)
    
    # Check if file exists
    if not os.path.exists(full_path):
        # If index.html doesn't exist, list available files
        if filepath == 'index.html':
            files = []
            if os.path.exists(project_dir):
                for root, dirs, filenames in os.walk(project_dir):
                    for filename in filenames:
                        rel_path = os.path.relpath(os.path.join(root, filename), project_dir)
                        files.append(rel_path.replace('\\', '/'))
            
            return f"""
            <html>
            <head><title>Generated Project</title></head>
            <body>
                <h1>Generated Project Files</h1>
                <p>No index.html found. Available files:</p>
                <ul>
                    {''.join([f'<li><a href="/preview/{f}">{f}</a></li>' for f in files])}
                </ul>
            </body>
            </html>
            """
        return jsonify({"error": "File not found"}), 404
    
    return send_from_directory(project_dir, filepath)

@app.route('/api/preview-url', methods=['GET'])
def get_preview_url():
    """Get the preview URL for the generated project"""
    return jsonify({
        "url": "http://localhost:5000/preview/",
        "message": "Open this URL to preview the generated project"
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000, threaded=True)
