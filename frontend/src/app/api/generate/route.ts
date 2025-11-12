import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description } = body;

    if (!name || !description) {
      return NextResponse.json(
        { error: 'Name and description are required' },
        { status: 400 }
      );
    }

    // Build the prompt expected by Flask
    const prompt = `Project Name: ${name}\nDescription: ${description}`;

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:5000';
    
    try {
      // Start generation request
      const response = await fetch(`${backendUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (response.ok) {
        const data = await response.json();
        // Return the request_id so frontend can poll for status
        return NextResponse.json({
          request_id: data.request_id,
          status: data.status,
          message: data.message
        });
      } else {
        throw new Error('Backend service unavailable');
      }
    } catch (error) {
      console.log('Backend not available, using mock data:', error);
      
      // Mock response when backend is not available
      const mockProject = {
        id: Date.now().toString(),
        name: name,
        description: description,
        html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name}</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <header class="hero">
            <h1>${name}</h1>
            <p class="subtitle">${description}</p>
            <button class="cta-button" id="cta">Get Started</button>
        </header>
        
        <section class="features">
            <div class="feature">
                <h3>Feature 1</h3>
                <p>Amazing functionality that makes this project special.</p>
            </div>
            <div class="feature">
                <h3>Feature 2</h3>
                <p>Innovative solutions for modern problems.</p>
            </div>
            <div class="feature">
                <h3>Feature 3</h3>
                <p>Cutting-edge technology at your fingertips.</p>
            </div>
        </section>
    </div>
    <script src="script.js"></script>
</body>
</html>`,
        css: `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: #333;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

.hero {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    text-align: center;
    padding: 100px 20px;
    min-height: 80vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.hero h1 {
    font-size: 3.5rem;
    margin-bottom: 1rem;
    font-weight: 700;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.subtitle {
    font-size: 1.25rem;
    margin-bottom: 2rem;
    opacity: 0.9;
    max-width: 600px;
}

.cta-button {
    background: #ff6b6b;
    color: white;
    border: none;
    padding: 15px 40px;
    font-size: 1.2rem;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}

.cta-button:hover {
    background: #ff5252;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.3);
}

.features {
    padding: 80px 0;
    background: #f8f9fa;
}

.features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 40px;
    padding: 80px 20px;
}

.feature {
    background: white;
    padding: 40px;
    border-radius: 15px;
    text-align: center;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    transition: transform 0.3s ease;
}

.feature:hover {
    transform: translateY(-5px);
}

.feature h3 {
    color: #667eea;
    font-size: 1.5rem;
    margin-bottom: 1rem;
}

.feature p {
    color: #666;
    line-height: 1.6;
}

@media (max-width: 768px) {
    .hero h1 {
        font-size: 2.5rem;
    }
    
    .features {
        grid-template-columns: 1fr;
    }
}`,
        js: `document.addEventListener('DOMContentLoaded', function() {
    console.log('${name} is loaded and ready!');
    
    // Add smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // CTA Button interaction
    const ctaButton = document.getElementById('cta');
    if (ctaButton) {
        ctaButton.addEventListener('click', function() {
            alert('Welcome to ${name}! This is your AI-generated project.');
            this.style.background = 'linear-gradient(45deg, #4ecdc4, #44a08d)';
            this.textContent = 'Awesome!';
        });
    }
    
    // Add some interactive features
    const features = document.querySelectorAll('.feature');
    features.forEach((feature, index) => {
        feature.addEventListener('mouseenter', function() {
            this.style.background = 'linear-gradient(45deg, #f8f9fa, #e9ecef)';
        });
        
        feature.addEventListener('mouseleave', function() {
            this.style.background = 'white';
        });
    });
    
    // Add a fun typing effect to the title
    const title = document.querySelector('.hero h1');
    if (title) {
        const originalText = title.textContent;
        title.textContent = '';
        let i = 0;
        
        function typeWriter() {
            if (i < originalText.length) {
                title.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        }
        
        setTimeout(typeWriter, 500);
    }
});`,
        createdAt: new Date().toISOString(),
      };

      return NextResponse.json(mockProject);
    }
  } catch (error) {
    console.error('Error generating project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}