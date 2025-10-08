from flask import Flask, render_template, request, jsonify, send_from_directory, send_file
import os
import sys
import traceback
import json
import zipfile
import tempfile
import shutil
from threading import Thread
import uuid
from datetime import datetime
from pydantic import BaseModel
from pathlib import Path

from agent.graph import agent
from agent.tools import PROJECT_ROOT, init_project_root

app = Flask(__name__)

# Store job results in memory (in production, use Redis or database)
job_results = {}
job_status = {}

def serialize_result(obj):
    """Recursively serialize Pydantic models and other objects to JSON-serializable format"""
    if isinstance(obj, BaseModel):
        return obj.model_dump()
    elif isinstance(obj, dict):
        return {key: serialize_result(value) for key, value in obj.items()}
    elif isinstance(obj, list):
        return [serialize_result(item) for item in obj]
    elif hasattr(obj, '__dict__'):
        # For other objects with __dict__, try to serialize their attributes
        return {key: serialize_result(value) for key, value in obj.__dict__.items() 
                if not key.startswith('_')}
    else:
        return obj

class JobRunner:
    def __init__(self, job_id, user_prompt, recursion_limit=100):
        self.job_id = job_id
        self.user_prompt = user_prompt
        self.recursion_limit = recursion_limit
    
    def run(self):
        try:
            job_status[self.job_id] = {
                'status': 'running',
                'started_at': datetime.now().isoformat(),
                'progress': 'Processing your request...'
            }
            
            # Initialize project root before starting
            init_project_root()
            
            result = agent.invoke(
                {"user_prompt": self.user_prompt},
                {"recursion_limit": self.recursion_limit}
            )
            
            # Serialize the result to make it JSON-serializable
            serialized_result = serialize_result(result)
            
            job_results[self.job_id] = {
                'status': 'completed',
                'result': serialized_result,
                'completed_at': datetime.now().isoformat()
            }
            job_status[self.job_id]['status'] = 'completed'
            job_status[self.job_id]['progress'] = 'Project generation completed successfully!'
            
        except Exception as e:
            error_trace = traceback.format_exc()
            job_results[self.job_id] = {
                'status': 'error',
                'error': str(e),
                'traceback': error_trace,
                'completed_at': datetime.now().isoformat()
            }
            job_status[self.job_id]['status'] = 'error'
            job_status[self.job_id]['progress'] = f'Error: {str(e)}'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/generate', methods=['POST'])
def generate_project():
    try:
        data = request.get_json()
        user_prompt = data.get('prompt', '').strip()
        recursion_limit = data.get('recursion_limit', 100)
        
        if not user_prompt:
            return jsonify({'error': 'Prompt is required'}), 400
        
        # Generate unique job ID
        job_id = str(uuid.uuid4())
        
        # Start background job
        job_runner = JobRunner(job_id, user_prompt, recursion_limit)
        thread = Thread(target=job_runner.run)
        thread.daemon = True
        thread.start()
        
        return jsonify({
            'job_id': job_id,
            'message': 'Project generation started',
            'status': 'started'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/status/<job_id>')
def get_job_status(job_id):
    if job_id not in job_status:
        return jsonify({'error': 'Job not found'}), 404
    
    status_info = job_status[job_id].copy()
    
    # If completed, include results
    if job_id in job_results:
        result_info = job_results[job_id].copy()
        # Ensure the result is serializable
        if 'result' in result_info:
            result_info['result'] = serialize_result(result_info['result'])
        status_info.update(result_info)
    
    return jsonify(status_info)

@app.route('/api/result/<job_id>')
def get_result(job_id):
    if job_id not in job_results:
        return jsonify({'error': 'Result not found'}), 404
    
    result_data = job_results[job_id].copy()
    # Ensure the result is serializable
    if 'result' in result_data:
        result_data['result'] = serialize_result(result_data['result'])
    
    return jsonify(result_data)

@app.route('/static/<path:filename>')
def static_files(filename):
    return send_from_directory('static', filename)

@app.route('/api/download/<job_id>')
def download_project(job_id):
    """Download the generated project as a ZIP file"""
    if job_id not in job_results:
        return jsonify({'error': 'Job not found'}), 404
    
    job_result = job_results[job_id]
    if job_result['status'] != 'completed':
        return jsonify({'error': 'Job not completed yet'}), 400
    
    try:
        # Initialize project root to ensure it exists
        init_project_root()
        
        # Check if generated_project directory exists and has files
        if not PROJECT_ROOT.exists() or not any(PROJECT_ROOT.iterdir()):
            return jsonify({'error': 'No generated project found'}), 404
        
        # Create a temporary ZIP file
        temp_dir = tempfile.mkdtemp()
        temp_zip_path = os.path.join(temp_dir, f'generated_project_{job_id}.zip')
        
        with zipfile.ZipFile(temp_zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
            # Add all files from the generated_project directory
            for file_path in PROJECT_ROOT.rglob('*'):
                if file_path.is_file():
                    # Get relative path for the archive
                    arcname = file_path.relative_to(PROJECT_ROOT)
                    zipf.write(file_path, arcname)
        
        # Send the file and clean up
        def remove_temp_file(response):
            try:
                shutil.rmtree(temp_dir)
            except:
                pass
            return response
        
        return send_file(
            temp_zip_path,
            as_attachment=True,
            download_name=f'generated_project_{job_id}.zip',
            mimetype='application/zip'
        )
        
    except Exception as e:
        return jsonify({'error': f'Failed to create download: {str(e)}'}), 500

@app.route('/api/project-files/<job_id>')
def get_project_files(job_id):
    """Get list of files in the generated project"""
    if job_id not in job_results:
        return jsonify({'error': 'Job not found'}), 404
    
    job_result = job_results[job_id]
    if job_result['status'] != 'completed':
        return jsonify({'error': 'Job not completed yet'}), 400
    
    try:
        # Initialize project root
        init_project_root()
        
        if not PROJECT_ROOT.exists():
            return jsonify({'files': []})
        
        files = []
        for file_path in PROJECT_ROOT.rglob('*'):
            if file_path.is_file():
                rel_path = file_path.relative_to(PROJECT_ROOT)
                file_size = file_path.stat().st_size
                files.append({
                    'path': str(rel_path).replace('\\', '/'),
                    'size': file_size,
                    'size_human': format_file_size(file_size)
                })
        
        return jsonify({'files': files})
        
    except Exception as e:
        return jsonify({'error': f'Failed to list files: {str(e)}'}), 500

def format_file_size(size_bytes):
    """Convert bytes to human readable format"""
    if size_bytes == 0:
        return "0 B"
    size_names = ["B", "KB", "MB", "GB"]
    import math
    i = int(math.floor(math.log(size_bytes, 1024)))
    p = math.pow(1024, i)
    s = round(size_bytes / p, 2)
    return f"{s} {size_names[i]}"

if __name__ == '__main__':
    # Create templates and static directories if they don't exist
    os.makedirs('templates', exist_ok=True)
    os.makedirs('static', exist_ok=True)
    
    # Use PORT environment variable for cloud deployment
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') != 'production'
    
    app.run(debug=debug, host='0.0.0.0', port=port)